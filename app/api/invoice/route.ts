import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import sgMail from "@sendgrid/mail";
import { createElement } from "react";
import type { ReactElement } from "react";
import { ListingInvoice } from "../../components/ListingInvoice";
import type { Listing } from "../../types/listing";
import { API_BASE, INVOICE } from "../../constants";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function fetchListing(id: string): Promise<Listing> {
  const res = await fetch(`${API_BASE}/listings/${id}`);
  if (!res.ok) throw new Error(`Listing fetch failed: ${res.status}`);
  return res.json();
}

async function buildPdf(listing: Listing): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(createElement(ListingInvoice, { listing }) as ReactElement<any>);
}

// GET /api/invoice?id=xxx  →  PDF download
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const listing = await fetchListing(id);
    const buffer = await buildPdf(listing);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${INVOICE.filename}-${id}.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

// POST /api/invoice  →  email PDF
export async function POST(req: NextRequest) {
  const { listingId, email } = await req.json();
  if (!listingId || !email) {
    return NextResponse.json({ error: "Missing listingId or email" }, { status: 400 });
  }

  try {
    const listing = await fetchListing(listingId);
    const buffer = await buildPdf(listing);

    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM!,
      subject: INVOICE.emailSubject(listing.listingTitle),
      text: INVOICE.emailBody(
        listing.listingTitle,
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.sellingPrice)
      ),
      attachments: [{
        content: buffer.toString("base64"),
        filename: `${INVOICE.filename}.pdf`,
        type: "application/pdf",
        disposition: "attachment",
      }],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

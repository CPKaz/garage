import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import nodemailer from "nodemailer";
import { createElement } from "react";
import type { ReactElement } from "react";
import { ListingInvoice } from "../../components/ListingInvoice";
import type { Listing } from "../../types/listing";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function fetchListing(id: string): Promise<Listing> {
  const res = await fetch(
    `https://garage-backend.onrender.com/listings/${id}`
  );
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
        "Content-Disposition": `attachment; filename="garage-invoice-${id}.pdf"`,
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

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Invoice: ${listing.listingTitle}`,
      text: `Your invoice for ${listing.listingTitle} (${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.sellingPrice)}) is attached.`,
      attachments: [{ filename: "garage-invoice.pdf", content: buffer }],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

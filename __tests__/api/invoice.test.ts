/** @jest-environment node */

// Must be declared before imports so Jest hoists them above the require() calls.
jest.mock("@react-pdf/renderer", () => ({
  Document: "Document",
  Page: "Page",
  Text: "Text",
  View: "View",
  Svg: "Svg",
  Path: "Path",
  StyleSheet: { create: (s: unknown) => s },
  renderToBuffer: jest.fn().mockResolvedValue(Buffer.from("fake-pdf")),
}));

jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

import { NextRequest } from "next/server";
import { GET, POST } from "../../app/api/invoice/route";
import sgMail from "@sendgrid/mail";

const mockListing = {
  id: "71a96c93-294f-42a5-90b8-14f13726326c",
  listingTitle: "2013 Spartan Sirius",
  sellingPrice: 50000,
  itemBrand: "Spartan",
  itemAge: 2013,
  itemWeight: null,
  itemLength: null,
  itemWidth: null,
  itemHeight: null,
  address: { state: "CA" },
  category: { name: "Fire Trucks" },
  ListingAttribute: [],
  listingImages: [],
};

function makeGet(search: string) {
  return new NextRequest(`http://localhost/api/invoice${search}`);
}

function makePost(body: object) {
  return new NextRequest("http://localhost/api/invoice", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockListing),
  });
});

describe("GET /api/invoice", () => {
  it("returns 400 when id param is missing", async () => {
    const res = await GET(makeGet(""));
    expect(res.status).toBe(400);
  });

  it("returns a PDF with correct headers for a valid id", async () => {
    const res = await GET(makeGet("?id=71a96c93-294f-42a5-90b8-14f13726326c"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toMatch(/attachment/);
    expect(res.headers.get("Content-Disposition")).toMatch(
      /71a96c93-294f-42a5-90b8-14f13726326c/
    );
  });

  it("returns 500 when the listing fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 });
    const res = await GET(makeGet("?id=71a96c93-294f-42a5-90b8-14f13726326c"));
    expect(res.status).toBe(500);
  });
});

describe("POST /api/invoice", () => {
  it("returns 400 when listingId or email is missing", async () => {
    const res = await POST(makePost({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 when only one required field is present", async () => {
    const res = await POST(makePost({ listingId: "abc" }));
    expect(res.status).toBe(400);
  });

  it("sends email and returns { ok: true } on success", async () => {
    (sgMail.send as jest.Mock).mockResolvedValueOnce(undefined);
    const res = await POST(
      makePost({
        listingId: "71a96c93-294f-42a5-90b8-14f13726326c",
        email: "user@example.com",
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sgMail.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: expect.stringContaining("2013 Spartan Sirius"),
        attachments: expect.arrayContaining([
          expect.objectContaining({ type: "application/pdf" }),
        ]),
      })
    );
  });

  it("returns 500 when SendGrid throws", async () => {
    (sgMail.send as jest.Mock).mockRejectedValueOnce(new Error("SendGrid error"));
    const res = await POST(
      makePost({
        listingId: "71a96c93-294f-42a5-90b8-14f13726326c",
        email: "user@example.com",
      })
    );
    expect(res.status).toBe(500);
  });

  it("returns 500 when the listing fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 });
    const res = await POST(
      makePost({
        listingId: "71a96c93-294f-42a5-90b8-14f13726326c",
        email: "user@example.com",
      })
    );
    expect(res.status).toBe(500);
  });
});

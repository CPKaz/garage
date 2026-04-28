import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const res = await fetch(`https://garage-backend.onrender.com/listings/${id}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

"use client";

import { useState } from "react";
import Image from "next/image";
import garageLogo from "./assets/garage-logo.svg";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleGenerate() {
    const match = url.match(
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
    );
    if (!match) {
      setError(true);
      return;
    }
    setError(false);
    const id = match[1];
    setLoading(true);
    try {
      const res = await fetch(`/api/listing?id=${id}`);
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error("Failed to fetch listing:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Top-left logo */}
      <div className="fixed top-5 left-6 flex items-center gap-2">
        <Image src={garageLogo} alt="Garage" height={32} />
      </div>

      {/* Center card button */}
      <main className="flex min-h-screen items-center justify-center bg-white">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-4 w-full max-w-sm rounded-2xl border border-gray-200 bg-white hover:bg-gray-100 px-5 py-4 shadow-sm cursor-pointer transition-all duration-150 active:scale-[0.98] outline-none focus:outline-none text-left"
        >
          {/* Pink document icon */}
          <div className="w-12 h-12 rounded-xl bg-pink-200 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#be185d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#be185d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Get PDF Invoice</p>
            <p className="text-sm text-gray-400">Create a PDF for any listing.</p>
          </div>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="text-gray-400 shrink-0">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </main>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => { setOpen(false); setError(false); setUrl(""); }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-8 pt-8 pb-6 border-b border-gray-100 text-center">
              <h2 className="text-xl font-bold text-gray-900">Get PDF Invoice</h2>
            </div>

            {/* Modal body */}
            <div className="px-8 py-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-400">Listing URL</label>
                <div className={`flex items-center rounded-xl border bg-gray-50 px-4 py-3 gap-2 transition-colors ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-gray-400"}`}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); if (error) setError(false); }}
                    placeholder="Paste a listing URL..."
                    className="flex-1 bg-transparent text-sm outline-none text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <circle cx="8" cy="8" r="8" fill="#ef4444"/>
                      <path d="M8 4.5v4M8 10.5v1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-sm text-red-500">Please enter a valid Garage listing URL</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 py-4 text-sm font-semibold text-white cursor-pointer transition-all duration-150 active:scale-95 outline-none focus:outline-none disabled:opacity-50"
              >
                {loading ? "Loading..." : "Generate PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    const match = url.match(
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
    );
    if (!match) {
      console.error("No UUID found in URL:", url);
      return;
    }
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
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 w-full max-w-xl px-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a listing URL..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>
    </main>
  );
}

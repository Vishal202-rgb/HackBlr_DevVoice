"use client";

import { useState } from "react";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold text-cyan-400">
        📄 Contract Analyzer
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste contract here..."
        className="w-full mt-6 p-4 rounded-xl bg-gray-900 border border-gray-700"
        rows={8}
      />

      <button
        onClick={analyze}
        className="mt-4 bg-cyan-400 text-black px-6 py-3 rounded-xl"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div className="mt-8 space-y-4">
          <div className="glass p-4 rounded-xl">
            <h2>Summary</h2>
            <p>{result.summary}</p>
          </div>

          <div className="glass p-4 rounded-xl">
            <h2>Risks</h2>
            {result.risks?.map((r: string, i: number) => (
              <p key={i}>⚠️ {r}</p>
            ))}
          </div>

          <div className="glass p-4 rounded-xl">
            <h2>Suggestions</h2>
            {result.suggestions?.map((s: string, i: number) => (
              <p key={i}>✅ {s}</p>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
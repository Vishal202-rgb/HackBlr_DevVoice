// import Link from "next/link";
// import { Mic, BrainCircuit, Bug, Database } from "lucide-react";
// import { TopNav } from "@/components/layout/TopNav";

// const highlights = [
//   {
//     title: "Voice-native flow",
//     text: "Speak naturally, get live transcript and spoken technical guidance.",
//     icon: Mic,
//   },
//   {
//     title: "Debug copiloting",
//     text: "Analyze stack traces, terminal logs, and broken code with fix paths.",
//     icon: Bug,
//   },
//   {
//     title: "Context memory",
//     text: "Persist and retrieve project notes, docs, and snippets with semantic recall.",
//     icon: Database,
//   },
//   {
//     title: "Developer reasoning",
//     text: "Generate pragmatic explanations, commands, and implementation suggestions.",
//     icon: BrainCircuit,
//   },
// ];

// export default function HomePage() {
//   return (
//     <div className="min-h-screen">
//       <TopNav />
//       <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 sm:px-6">
//         <section className="glass overflow-hidden rounded-3xl shadow-glow">
//           <div className="grid gap-10 p-8 lg:grid-cols-[1.1fr,0.9fr] lg:p-12">
//             <div>
//               <p className="mb-4 inline-block rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neon-cyan">
//                 Voice-Native Developer Experience Agent
//               </p>
//               <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
//                 DevVoice turns debugging and code learning into a live conversation.
//               </h1>
//               <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">
//                 Talk through errors, API confusion, and workflow friction. DevVoice transcribes your query,
//                 retrieves technical context from Qdrant, then responds with spoken and visual guidance.
//               </p>
//               <div className="mt-8 flex flex-wrap gap-3">
//                 <Link
//                   href="/dashboard"
//                   className="rounded-xl bg-neon-cyan px-5 py-3 font-medium text-ink-950 transition hover:bg-cyan-300"
//                 >
//                   Launch Dashboard
//                 </Link>
//                 <Link
//                   href="/demo"
//                   className="rounded-xl border border-ink-700 bg-ink-900/70 px-5 py-3 font-medium text-slate-200 transition hover:border-neon-mint/50 hover:text-white"
//                 >
//                   View Demo Flow
//                 </Link>
//               </div>
//             </div>
//             <div className="relative">
//               <div className="glass animate-float rounded-2xl p-5">
//                 <p className="text-xs uppercase tracking-wider text-neon-mint">Sample voice prompt</p>
//                 <p className="mt-2 text-lg text-white">
//                   Why is my React useEffect causing repeated renders when fetching data?
//                 </p>
//                 <div className="mt-5 rounded-xl bg-ink-950/70 p-4 text-sm text-slate-300">
//                   <p className="text-neon-cyan">DevVoice response preview</p>
//                   <p className="mt-2">
//                     Your effect depends on state that it mutates. Split data fetching from derivation and
//                     memoize callback dependencies.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//           {highlights.map((item) => {
//             const Icon = item.icon;
//             return (
//               <article key={item.title} className="glass rounded-2xl p-5">
//                 <Icon className="h-5 w-5 text-neon-cyan" />
//                 <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
//                 <p className="mt-2 text-sm text-slate-300">{item.text}</p>
//               </article>
//             );
//           })}
//         </section>
//       </main>
//     </div>
//   );
// }

"use client";

import { TopNav } from "@/components/layout/TopNav";
import Hero from "@/components/Home/Hero";

export default function HomePage() {
  return (
    <div>
      <TopNav />

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-20">

        {/* HERO */}
        <Hero />

        {/* 🔥 PROBLEM STATEMENT */}
        <section className="glass rounded-3xl p-10">
          <h2 className="text-3xl font-bold text-white">
            ⚖️ Problem Statement
          </h2>

          <p className="mt-4 text-gray-300 max-w-3xl">
            Build a voice-first AI agent capable of multi-step reasoning,
            dynamic document generation, and real-time decision support
            for legal workflows.
          </p>

          <ul className="mt-6 space-y-3 text-gray-400">
            <li>• Understand voice queries</li>
            <li>• Analyze contracts & documents</li>
            <li>• Retrieve legal knowledge (RAG)</li>
            <li>• Suggest risk-aware improvements</li>
          </ul>
        </section>

        {/* 🚀 FEATURES */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">
            🚀 Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Voice AI Assistant",
              "Contract Analyzer",
              "Context Memory (RAG)",
              "Real-time Suggestions",
            ].map((feature) => (
              <div
                key={feature}
                className="glass p-6 rounded-2xl hover:scale-105 transition"
              >
                <h3 className="text-lg font-semibold text-cyan-400">
                  {feature}
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  Powerful AI capability for developers & legal workflows.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ⚡ HOW IT WORKS */}
        <section className="glass rounded-3xl p-10">
          <h2 className="text-3xl font-bold text-white mb-6">
            ⚡ How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              "🎤 Speak",
              "🧠 AI Understands",
              "🔎 Retrieve Context",
              "⚡ Get Solution",
            ].map((step, i) => (
              <div key={i} className="p-4">
                <div className="text-2xl">{step}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 🎯 FINAL CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to experience DevVoice?
          </h2>

          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/dashboard"
              className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-semibold"
            >
              Start Now
            </a>

            <a
              href="/demo"
              className="border px-6 py-3 rounded-xl"
            >
              View Demo
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
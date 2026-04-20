// import { TopNav } from "@/components/layout/TopNav";
// import { DevVoiceConsole } from "@/components/dashboard/DevVoiceConsole";
// import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
// import { RuntimeStatusBadge } from "@/components/dashboard/RuntimeStatusBadge";

// export default function DashboardPage() {
//   return (
//     <div className="min-h-screen">
//       <TopNav />
//       <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
//         <RuntimeStatusBadge />
//         <ErrorBoundary>
//           <DevVoiceConsole />
//         </ErrorBoundary>
//       </main>
//     </div>
//   );
// }


"use client";

import { TopNav } from "@/components/layout/TopNav";
import { DevVoiceConsole } from "@/components/dashboard/DevVoiceConsole";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { RuntimeStatusBadge } from "@/components/dashboard/RuntimeStatusBadge";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <TopNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* 🔥 Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-white"
          >
            DevVoice Dashboard
          </motion.h1>

          <RuntimeStatusBadge />
        </div>

        {/* 💎 MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass rounded-2xl p-4"
          >
            <ErrorBoundary>
              <DevVoiceConsole />
            </ErrorBoundary>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-5 space-y-4"
          >
            <h2 className="text-lg font-semibold text-cyan-400">
              AI Insights
            </h2>

            <div className="rounded-xl bg-[#020617] p-4 border border-gray-800">
              <p className="text-sm text-gray-400">System Status</p>
              <p className="text-green-400 font-medium">All systems active</p>
            </div>

            <div className="rounded-xl bg-[#020617] p-4 border border-gray-800">
              <p className="text-sm text-gray-400">Last Query</p>
              <p className="text-white text-sm">
                Awaiting user input...
              </p>
            </div>

            <div className="rounded-xl bg-[#020617] p-4 border border-gray-800">
              <p className="text-sm text-gray-400">AI Mode</p>
              <p className="text-cyan-300 font-medium">
                Voice + RAG Enabled
              </p>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
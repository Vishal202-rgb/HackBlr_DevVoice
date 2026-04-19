// import Link from "next/link";


// const links = [
//   { href: "/", label: "Home" },
//   { href: "/dashboard", label: "Dashboard" },
//   { href: "/knowledge", label: "Knowledge Base" },
//   { href: "/history", label: "Sessions" },
//   { href: "/demo", label: "Demo" },
// ];

// export function TopNav() {
//   return (
//     <header className="sticky top-0 z-40 border-b border-ink-700/40 bg-ink-950/85 backdrop-blur">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
//         <Link href="/" className="text-xl font-semibold tracking-tight text-neon-cyan">
//           DevVoice
//         </Link>
//         <nav className="flex gap-2 text-sm text-slate-300 sm:gap-4">
//           {links.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="rounded-md px-2 py-1 transition hover:bg-ink-800 hover:text-white"
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";

export function TopNav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <h1 className="text-xl font-bold text-cyan-400">DevVoice</h1>
      <div className="flex gap-4 text-sm">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/demo">Demo</Link>
      </div>
    </nav>
  );
}
export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-950 mt-10">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} DevVoice. All rights reserved.</p>
        <p className="mt-2 text-cyan-400 font-medium">
          Built by Team Bunkers
        </p>
      </div>
    </footer>
  );
}
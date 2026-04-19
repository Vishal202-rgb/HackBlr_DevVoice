// import type { Metadata } from "next";
// import "./globals.css";
// import { Footer } from "@/components/layout/Footer";

// export const metadata: Metadata = {
//   title: "DevVoice",
//   description: "Voice-native developer experience agent",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "DevVoice",
  description: "Voice-native developer experience agent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-x-hidden">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import AppShell from "./AppShell";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CRM",
  description: "Manage your contacts, notes and tasks",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${publicSans.variable} font-sans antialiased bg-canvas text-ink`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

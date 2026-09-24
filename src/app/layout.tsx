import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Axiomixs Law | Verified Legal Information",
  description: "Find verified legal information, laws, and professional resources for your jurisdiction.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          {/* Header/Navbar goes here */}
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          {/* Footer goes here */}
        </div>
      </body>
    </html>
  );
}

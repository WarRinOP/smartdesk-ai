import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartDesk — AI Customer Support",
  description:
    "Trainable AI customer support system. Upload your documents and let AI answer your customer questions instantly.",
  keywords: ["AI customer support", "chatbot", "knowledge base", "RAG", "SmartDesk"],
  authors: [{ name: "Abrar Tajwar Khan" }],
  openGraph: {
    title: "SmartDesk — AI Customer Support",
    description: "AI-powered customer support trained on your own documents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-[var(--font-inter)]">{children}</body>
    </html>
  );
}

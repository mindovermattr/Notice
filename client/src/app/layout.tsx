import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../assets/global.scss";

const geistMono = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated b create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistMono.variable}`}>{children}</body>
    </html>
  );
}

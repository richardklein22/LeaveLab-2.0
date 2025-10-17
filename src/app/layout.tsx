import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeaveLab - Digital Nomad Platform",
  description: "Empower your location-independent career journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="antialiased">{children}</body>
    </html>
  );
}

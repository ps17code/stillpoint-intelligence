import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stillpoint Intelligence",
  description: "Supply chain intelligence for frontier technology sectors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Geist+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

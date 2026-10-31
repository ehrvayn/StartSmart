import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DarkModeProvider } from "../context/Darkmode";
import "./globals.css";

export const metadata: Metadata = {
  title: "StartSmart",
  description:
    "AI-powered business viability analyzer. Enter your business idea, get instant insights on costs, timeline, risks, and legality.",
  icons: {
    icon: "/StartSmartLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DarkModeProvider>{children}</DarkModeProvider>
      </body>
    </html>
  );
}

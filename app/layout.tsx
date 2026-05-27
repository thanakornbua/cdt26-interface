import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "SeismoGuard-R Dashboard",
  description: "Computer dashboard for the SeismoGuard-R UNO Q robot",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

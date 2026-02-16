import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Intentness Consultancy | Support Staffing for US Teams",
  description:
    "Intentness Consultancy Private Limited provides support staffing and operational consulting for US-focused companies.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

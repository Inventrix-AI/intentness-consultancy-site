import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Intentness Consultancy | Enterprise Technology & Support Services",
  description:
    "Intentness Consultancy delivers enterprise collaboration, networking, CX, automation and software engineering services for global clients.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  icons: {
    icon: "/intentness-logo-icon.png",
    apple: "/intentness-logo-icon.png"
  },
  openGraph: {
    title: "Intentness Consultancy | Enterprise Technology & Support Services",
    description:
      "Enterprise collaboration, networking, CX, automation and software engineering services for global clients.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

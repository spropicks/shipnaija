import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shipnaija.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ShipNaija.dev — Build in public, Naija style",
    template: "%s · ShipNaija.dev",
  },
  description:
    "A Nigerian build-in-public community where solo developers share what they're building every day and help each other ship products faster.",
  keywords: [
    "Nigeria",
    "developers",
    "build in public",
    "indie hackers",
    "startups",
    "side projects",
    "Naija tech",
    "ship",
  ],
  openGraph: {
    type: "website",
    siteName: "ShipNaija.dev",
    title: "ShipNaija.dev — Build in public, Naija style",
    description:
      "A Nigerian build-in-public community where solo developers share what they're building every day and help each other ship products faster.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipNaija.dev — Build in public, Naija style",
    description:
      "Where Naija builders ship in public. Daily build logs, project showcases, streaks and weekly ship challenges.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}

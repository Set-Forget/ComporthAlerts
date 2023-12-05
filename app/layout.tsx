import { GeistSans } from "geist/font";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL("https://comporth-alerts-set-and-forget.vercel.app" || ""),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={"h-full bg-white"}>
      <body className="h-full">
        <main className="h-full">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

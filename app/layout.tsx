import type { Metadata } from "next";
import { getHeaderRes, getFooterRes } from "../lib/contentstack/api";
import LivePreviewProvider from "../components/LivePreviewProvider";
import HeaderClient from "../components/layout/HeaderClient";
import FooterClient from "../components/layout/FooterClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thread Theory - Modern Clothing",
  description: "Next Generation Clothing Store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global data on the Server
  const [headerData, footerData] = await Promise.all([
    getHeaderRes(),
    getFooterRes()
  ]);

  return (
    <html lang="en">
      <body className="antialiased font-sans flex flex-col min-h-screen text-stone-900 bg-white">
        <LivePreviewProvider>
          <HeaderClient initialData={headerData} />
          
          <main className="flex-1">
            {children}
          </main>
          
          <FooterClient initialData={footerData} />
        </LivePreviewProvider>
      </body>
    </html>
  );
}

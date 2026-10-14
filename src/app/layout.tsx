import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { StoreProvider } from "@/lib/store-context";

export const metadata: Metadata = {
  title: "LUGA // Contemporary Nepali Luxury Streetwear & Artisanal Fashion",
  description:
    "High-fashion South Asian contemporary editorial streetwear, handcrafted in Kathmandu Valley, Nepal. 420-580 GSM artisanal silhouettes, traditional handloom Dhaka and Yak wool blends.",
  keywords: [
    "LUGA",
    "Nepali Streetwear",
    "Luxury Fashion Nepal",
    "Kathmandu Fashion",
    "Artisanal Handloom",
    "Rastah Inspired",
    "South Asian Luxury",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-luga-bg dark:bg-luga-darkBg text-luga-ink dark:text-luga-darkInk selection:bg-luga-crimson selection:text-white dark:selection:bg-luga-gold dark:selection:text-black">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <StoreProvider>
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

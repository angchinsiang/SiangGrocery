import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Itim, Henny_Penny } from "next/font/google";
import "../globals.css";
import NavBar from "./NavBar";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Footer from "./Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const hennyPenny = Henny_Penny({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-hennypenny",
});

const itim = Itim({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-itim",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Siang Grocery",
  description: "Landing page of Siang Grocery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`${itim.variable} ${inter.variable} ${hennyPenny.variable} antialiased`}
      >
        <ClerkProvider>
          <NavBar></NavBar>
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppProvider } from "../providers/AppContextProvider";
import "./globals.css";
import { cookies } from "next/headers";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cash Flow",
  description: "Handle your finance right here!!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("jwt_token");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
        <AppProvider>
          {token && <Navbar />}
          <div className="min-h-screen bg-[#F9FAFB] overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </div>
          </div>
          {token && <Footer />}
        </AppProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import PageContainer from "~/components/layout/pageContainer";
import Navbar from "~/components/layout/navbar";
import { Toaster } from "sonner";
import { BackgroundGradientAnimation } from "~/components/ui/backgorund-gradient-animation";
import { cn } from "~/lib/utils";
const inter = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} dark bg-gradient-to-br from-purple-600 to-pink-600 bg-blur min-h-screen w-full`}
      >
        <Toaster position="bottom-right" />
        <BackgroundGradientAnimation></BackgroundGradientAnimation>
        <Navbar />
        <PageContainer>{children}</PageContainer>
      </body>
    </html>
  );
}

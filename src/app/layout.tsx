import type { Metadata } from "next";
import { Lora, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const lora = Lora({
  variable: "--font-primary",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-secondary",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Squeak - Learn Languages Reading What You Love",
  description: "A language-learning platform where you read news and stories at your proficiency level.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${montserrat.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

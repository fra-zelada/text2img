import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ["latin"] });

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});
const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-raleway",
});
export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600
        <html lang="en">
            <body
                className={
                    `${GeistSans.variable} ${GeistMono.variable} ${raleway.variable} flex flex-col   bg-fixed cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )` +
                    cn(
                        "min-h-screen bg-background font-sans antialiased",
                        fontSans.variable
                    )
                }
            >
                <header className="bg-black text-white min-h-7 flex items-center justify-center">
                    <div className="max-w-[500px] w-full flex items-center justify-start px-2">
                        <Link href={"/"} className="font-semibold">
                            Text2Img
                        </Link>
                    </div>
                </header>
                {children}
                <Toaster />
                <footer className="bg-black text-white min-h-7 flex items-center justify-center mt-auto">
                    <a href="https://github.com/fra-zelada">@fra-zelada</a>
                </footer>
            </body>
        </html>
    );
}

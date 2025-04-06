import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import CustomLoader from "@/components/CustomLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Expense Tracker",
  description: "Created by Prashanth Kusuma",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative w-full h-[100dvh] pt-[75px] bg-gradient-to-br from-purple-800 via-pink-600 to-yellow-500 dark:from-blue-900 dark:via-black dark:to-gray-900 overflow-hidden">
            <Suspense fallback={<CustomLoader/>}>
              <div className="w-full h-[100dvh] p-5">{children}</div>
            </Suspense>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

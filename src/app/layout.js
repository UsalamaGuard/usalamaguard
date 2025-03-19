import localFont from "next/font/local";
import ClientProvider from "./components/ClientProvider";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import "./globals.css";

// Define custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for UsalamaAiGuard
export const metadata = {
  title: "UsalamaGuard",
  description: "IoT-powered security surveillance system with real-time detection and notifications.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text`}>
        <ThemeProvider>
          <ClientProvider>{children}</ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
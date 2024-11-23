import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "./components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuickBet Movies",
  description: "Your favorite movies platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

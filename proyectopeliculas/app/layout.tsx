import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-black">
        <AuthProvider>
          <Header />
          <div className="flex flex-col min-h-screen">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}

// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ChatBotIcon from "./components/layout/ChatBotIcon";
import { AuthProvider } from "./contexts/AuthContext";
import { NextAuthProvider } from "./providers"; // Nuevo componente que crearemos

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sylicon Marketplace - Tokens Inmobiliarios",
  description: "Marketplace para comprar y vender tokens inmobiliarios tokenizados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen flex flex-col`}>
        <NextAuthProvider> {/* Añadimos NextAuthProvider alrededor de todo */}
          <AuthProvider>
            <Header />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
            <ChatBotIcon />
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
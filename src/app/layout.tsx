import { Metadata } from "next";
import "./globals.css";
import "@/assets/bootstrap/css/bootstrap.min.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AptosWalletProvider } from "@/context/AptosWalletProvider";
export const metadata: Metadata = {
  title: 'Immutable Legends',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AptosWalletProvider>
          <Navbar />
          <hr />
          {children}
          <hr />
          <Footer />
        </AptosWalletProvider>
      </body>
    </html>
  )
}

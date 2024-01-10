import { Metadata } from "next";
import "./globals.css";
import "@/assets/bootstrap/css/bootstrap.min.css";
import Navbar from "@/assets/components/Navbar";
import Footer from "@/assets/components/Footer";
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
        <Navbar />
        <hr />
        {children}
        <hr />
        <Footer />
      </body>
    </html>
  )
}

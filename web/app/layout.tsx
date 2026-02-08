import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import LayoutClient from "./components/LayoutClient";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "OBIEKTYW - Analiza polskich mediów i technik manipulacji",
  description: "Platforma agregująca polskie media i analizująca je pod kątem stronniczości oraz technik manipulacji. Wykorzystujemy AI do świadomego odbioru informacji.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${archivo.variable} ${instrumentSerif.variable} antialiased`}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}

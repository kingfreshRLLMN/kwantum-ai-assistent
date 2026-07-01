import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kwantum AI Assistent",
  description: "Mobile-first kennisapp voor Kwantum medewerkers",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={{
        formButtonPrimary: "Verder",
        formButtonPrimary__verify: "Controleren",
        signUp: {
          emailCode: {
            title: "Controleer je e-mail",
            subtitle: "Er is een code gestuurd naar {{identifier}}.",
            formTitle: "",
            formSubtitle: "",
            resendButton: "Geen code ontvangen? Opnieuw sturen",
          },
        },
      }}
    >
      <html lang="nl" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

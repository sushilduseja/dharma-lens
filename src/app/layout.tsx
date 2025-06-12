
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

export const metadata: Metadata = {
  title: 'Divya Drishti',
  description: 'Personalized spiritual insight and guidance from Divine Vision.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Ensure correct weights are loaded. PRD mentions 'Literata' serif. Using variable font is good. */}
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Noto+Sans+Devanagari:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      {/* antialiased is good, min-h-screen and flex flex-col are fine for basic layout */}
      <body className="font-body antialiased min-h-screen flex flex-col bg-background selection:bg-primary/30 selection:text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

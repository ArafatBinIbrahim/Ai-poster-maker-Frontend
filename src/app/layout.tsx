import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Political Poster Maker',
  description: 'Create stunning political posters in seconds with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
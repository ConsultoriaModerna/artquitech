import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArtquiTech - Scan. Design. Build.',
  description: 'Turn any space into a renovation plan in minutes with AR visualization and smart shopping lists.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://artquitech.com',
    title: 'ArtquiTech - Scan. Design. Build.',
    description: 'Turn any space into a renovation plan in minutes with AR visualization and smart shopping lists.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}

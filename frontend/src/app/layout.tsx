import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'EduVerse – AI Telugu Reading & Literacy Platform',
  description:
    'EduVerse: Next-generation government school-focused AI SaaS platform that assesses children\'s Telugu reading abilities, identifies weaknesses, and provides personalized learning recommendations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="te">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}


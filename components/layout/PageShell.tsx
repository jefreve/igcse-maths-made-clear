import SiteHeader from './SiteHeader';

interface PageShellProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export default function PageShell({ children, maxWidth = 'max-w-4xl' }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className={`flex-1 w-full ${maxWidth} mx-auto px-4 sm:px-6 py-8`}>
        {children}
      </main>
      <footer className="w-full bg-[#0C1F3C] border-t border-white/10 py-6">
        <p className="text-center text-white/40 text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-montserrat)' }}>
          IGCSE Maths Made Clear &mdash; Mistakes mean you&apos;re actually doing it
        </p>
      </footer>
    </div>
  );
}

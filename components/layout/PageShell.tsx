import SiteHeader from './SiteHeader';

interface PageShellProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export default function PageShell({ children, maxWidth = 'max-w-4xl' }: PageShellProps) {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px), url('/sfondo.png')",
        backgroundSize: "40px 40px, 40px 40px, cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundColor: "#f8fafc"
      }}
    >
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

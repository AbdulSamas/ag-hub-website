import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="pt-[68px] sm:pt-[76px] min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="clash text-[64px] sm:text-[96px] font-bold text-ink leading-none mb-4">404</h1>
        <p className="text-secondary text-[15px] mb-6 font-light">This page could not be found.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-accent text-primary font-semibold text-[13px] px-6 py-3 rounded-full cta-glow"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

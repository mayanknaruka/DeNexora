import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { COPY } from '../../i18n/public';

export function SiteNav({ onGetStarted }: { onGetStarted?: () => void }) {
  const { user } = useAuth();
  const { lang, toggleLang } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const onLanding = location.pathname === '/';
  const c = COPY[lang].nav;

  const activeHash = location.hash.replace('#', '');

  const start = () => {
    if (onGetStarted) onGetStarted();
    else navigate('/?start=1');
  };

  const links: { to?: string; hash?: string; label: string }[] = [
    { to: '/', label: c.home },
    { hash: 'how-it-works', label: c.how },
    { hash: 'for-you', label: c.forYou },
    { hash: 'features', label: c.features },
    { to: '/about', label: c.about },
    { hash: 'workspaces', label: c.workspaces },
  ];

  return (
    <header className="sticky top-0 z-40 shadow-md bg-[#1a3d2b]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="shrink-0" aria-label="AyuSetu home">
          <img src="/ayush-logo.png" alt="Ministry of Ayush" className="h-12 w-auto object-contain rounded bg-white px-2 py-0.5" />
        </Link>

        {/* Nav links — centered in the green bar */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {links.map(l => {
            const active = l.to
              ? location.pathname === l.to && (l.to !== '/' || !activeHash)
              : onLanding && activeHash === l.hash;
            const className = `whitespace-nowrap rounded-lg px-4 py-2 text-[15px] font-bold text-green-100 transition hover:bg-green-700 hover:text-white ${
              active ? 'bg-green-700 text-white' : ''
            }`;
            return l.to ? (
              <Link key={l.to} to={l.to} className={className}>
                {l.label}
              </Link>
            ) : (
              <Link
                key={l.hash}
                to={{ pathname: '/', hash: l.hash }}
                className={className}
                onClick={() => {
                  if (onLanding) {
                    document.getElementById(l.hash!)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-xl border border-green-600 px-3 py-1.5 text-sm font-bold text-green-100 hover:bg-green-800 transition"
            aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
          >
            {lang === 'en' ? 'हिन्दी' : 'EN'}
          </button>
          {user ? (
            <Link to="/dashboard" className="btn-primary">
              {c.openWorkspace}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-base font-bold text-green-100 transition hover:bg-green-800"
              >
                {c.login}
              </Link>
              <button
                type="button"
                className="rounded-xl bg-white px-5 py-2.5 text-base font-bold text-[#1a3d2b] transition hover:bg-green-100"
                onClick={start}
              >
                {c.getStarted}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

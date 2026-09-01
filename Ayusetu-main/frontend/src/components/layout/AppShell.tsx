import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Search,
  Users,
  BarChart3,
  FileCheck,
  GraduationCap,
  Building2,
  FolderKanban,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABEL } from '../Logo';
import { SearchTrigger } from '../CommandPalette';
import { PageSkeleton } from '../ui/Skeleton';
import type { User } from '../../types/api';

const NAV: Record<User['role'], { to: string; label: string; icon: typeof LayoutDashboard }[]> = {
  student: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/assessment', label: 'Assessment', icon: ClipboardList },
    { to: '/skills', label: 'Skill map', icon: BookOpen },
    { to: '/opportunities', label: 'Internships', icon: Briefcase },
    { to: '/applications', label: 'Tracker', icon: FolderKanban },
    { to: '/portfolio', label: 'Profile', icon: FileCheck },
  ],
  academician: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/faculty/internships', label: 'Internships', icon: Briefcase },
    { to: '/faculty/fdp', label: 'FDP', icon: GraduationCap },
    { to: '/faculty/research', label: 'Research', icon: BookOpen },
    { to: '/applications', label: 'Applications', icon: FolderKanban },
  ],
  industry: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/industry/opportunities', label: 'Postings', icon: Briefcase },
    { to: '/industry/applications', label: 'Applicants', icon: Users },
    { to: '/industry/programs', label: 'Training', icon: GraduationCap },
  ],
  institution: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/institution/students', label: 'Students', icon: Users },
    { to: '/institution/placements', label: 'Placements', icon: Briefcase },
    { to: '/institution/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  admin: [
    { to: '/dashboard', label: 'National', icon: LayoutDashboard },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/verifications', label: 'Verify', icon: FileCheck },
    { to: '/admin/users', label: 'Directory', icon: Building2 },
  ],
};

const NOTICES = [
  { t: 'Interview scheduled', d: 'MDNIY Yoga Therapy — Fri 11:00' },
  { t: 'Shortlisted', d: 'AIIA Panchakarma intern' },
  { t: 'Skill verified', d: 'NIA attested Yoga therapy' },
];

export default function AppShell() {
  const { user, logout, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bell, setBell] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const t = window.setTimeout(() => setReady(true), 380);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  if (!user) return null;
  const links = NAV[user.role];

  return (
    <div className="flex min-h-screen bg-cream-100">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 px-5 py-4">
          <img src="/ayush-logo.png" alt="Ministry of Ayush" className="h-14 w-auto object-contain" />
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {links.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-forest-50 text-forest-800' : 'text-ink-500 hover:bg-cream-100 hover:text-ink-900'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <p className="border-t border-slate-100 px-5 py-4 text-xs text-ink-500">AYUSH pathways</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <img src="/ayush-logo.png" alt="Ministry of Ayush" className="h-10 w-auto object-contain" />
          </div>
          <SearchTrigger />
          <p className="hidden text-sm text-ink-500 lg:block xl:hidden">Skill mapping · internships</p>
          <div className="relative ml-auto flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-2 text-ink-700 hover:bg-cream-100 md:hidden"
              aria-label="Search internships"
              onClick={() => window.dispatchEvent(new Event('ayusetu-palette'))}
            >
              <Search size={18} />
            </button>
            <button className="relative rounded-lg p-2 text-ink-700 hover:bg-cream-100" aria-label="Notifications" onClick={() => setBell(v => !v)}>
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-saffron-500" />
            </button>
            {bell && (
              <div className="absolute right-12 top-11 z-30 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                <p className="border-b px-4 py-2 text-xs font-semibold text-ink-500">Updates</p>
                {NOTICES.map(n => (
                  <button
                    key={n.t}
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm hover:bg-cream-100"
                    onClick={() => {
                      setBell(false);
                      navigate('/applications');
                    }}
                  >
                    <span className="font-medium text-ink-900">{n.t}</span>
                    <span className="mt-0.5 block text-xs text-ink-500">{n.d}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-cream-100 py-1 pl-1 pr-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-xs font-bold text-white">
                {user.name.slice(0, 1)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-none text-ink-900">{user.name.split(' ')[0]}</p>
                <p className="mt-0.5 text-[10px] text-ink-500">{ROLE_LABEL[user.role]}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-700"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 pb-24 lg:px-10 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="mx-auto w-full max-w-5xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {ready ? <Outlet /> : <PageSkeleton />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Workspace"
      >
        <div className="flex">
          {links.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium ${
                    isActive ? 'text-forest-800' : 'text-ink-500'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-forest-700' : ''} />
                    <span className="w-full truncate text-center">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

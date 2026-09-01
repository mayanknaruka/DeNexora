import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import type { User } from '../types/api';
import LiveMatchCard from '../components/landing/LiveMatchCard';
import { SiteNav } from '../components/layout/SiteNav';
import { SiteFooter } from '../components/layout/SiteFooter';
import { Modal } from '../components/ui/Primitives';
import { COPY, PARTNERS } from '../i18n/public';

const FEATURE_ICONS = [GraduationCap, Building2, Brain, Briefcase, BarChart3];

const DEMO_ROLES: { role: User['role']; label: string; hint: string }[] = [
  { role: 'student', label: 'Student', hint: 'Match internships and track applications' },
  { role: 'academician', label: 'Faculty', hint: 'FDP, internships and research collabs' },
  { role: 'industry', label: 'Hospital', hint: 'Post requirements and rank applicants' },
  { role: 'institution', label: 'Institute', hint: 'Verify students and view placements' },
  { role: 'admin', label: 'Ministry of AYUSH', hint: 'National skill and placement insights' },
];

const ROLE_HI: Record<User['role'], { label: string; hint: string }> = {
  student: { label: 'विद्यार्थी', hint: 'इंटर्नशिप मैच करें और आवेदन ट्रैक करें' },
  academician: { label: 'संकाय', hint: 'एफडीपी, इंटर्नशिप और शोध सहयोग' },
  industry: { label: 'अस्पताल', hint: 'आवश्यकताएँ पोस्ट करें और आवेदक रैंक करें' },
  institution: { label: 'संस्थान', hint: 'विद्यार्थी सत्यापित करें और प्लेसमेंट देखें' },
  admin: { label: 'आयुष मंत्रालय', hint: 'राष्ट्रीय स्किल और प्लेसमेंट अंतर्दृष्टि' },
};

const QUESTIONS: Record<string, { id: string; label: string; options: string[] }[]> = {
  student: [
    { id: 'stream', label: 'Which AYUSH stream are you in?', options: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS'] },
    { id: 'year', label: 'Which year are you in?', options: ['1st year', '2nd year', '3rd year', 'Final year', 'Internship'] },
    { id: 'goal', label: 'What are you looking for?', options: ['Internship', 'Job / placement', 'Both'] },
    { id: 'skill', label: 'Which skill is your strongest today?', options: ['Panchakarma', 'Yoga therapy', 'Clinical documentation', 'Pharmacy / dravyaguna'] },
  ],
  academician: [
    { id: 'post', label: 'What is your primary role?', options: ['Faculty', 'HOD / coordinator', 'Research guide'] },
    { id: 'stream', label: 'Primary stream?', options: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS'] },
    { id: 'need', label: 'What do you want first?', options: ['Industry internship', 'FDP / workshop', 'Research collaboration'] },
    { id: 'type', label: 'Institute type?', options: ['National institute', 'State college', 'Private college'] },
  ],
  industry: [
    { id: 'org', label: 'What kind of organisation is this?', options: ['AYUSH hospital', 'Wellness centre', 'Research council', 'Pharmacy / manufacturing'] },
    { id: 'need', label: 'What are you hiring for?', options: ['Interns', 'Full-time roles', 'Both'] },
    { id: 'stream', label: 'Primary stream you need?', options: ['Ayurveda', 'Yoga', 'Unani', 'Siddha', 'Homoeopathy'] },
    { id: 'city', label: 'Primary location?', options: ['Delhi NCR', 'Jaipur', 'Kochi', 'Hyderabad', 'Multi-city'] },
  ],
  institution: [
    { id: 'type', label: 'What kind of institute is this?', options: ['National institute (NIA / AIIA / NIH / NIS / NIUM)', 'State government college', 'Private AYUSH college'] },
    { id: 'stream', label: 'Primary stream you want to map?', options: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS', 'More than one'] },
    { id: 'goal', label: 'What do you need first?', options: ['Verify student credentials', 'Track internships & placements', 'See skill gaps vs industry'] },
    { id: 'size', label: 'Approx. student strength?', options: ['Under 200', '200–500', '500+'] },
  ],
  admin: [
    { id: 'cell', label: 'Which cell are you viewing for?', options: ['Skill mapping', 'Internships & training', 'Placement data', 'Policy / curriculum'] },
    { id: 'stream', label: 'Which stream should the dashboard emphasise?', options: ['All AYUSH streams', 'Ayurveda', 'Yoga', 'Unani', 'Siddha', 'Homoeopathy'] },
    { id: 'need', label: 'What do you need to see first?', options: ['State-wise internships', 'National skill-gap report', 'Institute onboarding status'] },
    { id: 'region', label: 'Geographic focus?', options: ['All India', 'North', 'South', 'East', 'West'] },
  ],
};

export default function LandingPage() {
  const { enterDemo } = useAuth();
  const { lang } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<User['role'] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tab, setTab] = useState('students');
  const t = COPY[lang];

  const questions = role ? QUESTIONS[role] ?? [] : [];
  const complete = questions.length > 0 && questions.every(q => answers[q.id]);
  const roleMeta = DEMO_ROLES.find(r => r.role === role);
  const roleLabel = role ? (lang === 'hi' ? ROLE_HI[role].label : roleMeta?.label) : '';
  const audience = t.audience.tabs.find(x => x.id === tab) ?? t.audience.tabs[0];

  const reset = () => {
    setOpen(false);
    setRole(null);
    setAnswers({});
  };

  const begin = (next: User['role']) => {
    setRole(next);
    setAnswers({});
    setOpen(true);
  };

  const finish = () => {
    if (!role || !complete) return;
    sessionStorage.setItem('ayusetu-onboarding', JSON.stringify({ role, answers }));
    enterDemo(role);
    navigate('/dashboard');
  };

  useEffect(() => {
    if (new URLSearchParams(location.search).get('start') === '1') {
      setRole(null);
      setAnswers({});
      setOpen(true);
    }
  }, [location.search]);

  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => window.clearTimeout(t);
  }, [location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 text-ink-900">
      <Modal
        open={open}
        onClose={reset}
        kicker={t.modal.kicker}
        title={role ? `${t.modal.questions} · ${roleLabel}` : t.modal.choose}
      >
        <p className="-mt-3 mb-4 text-sm text-ink-500">{role ? t.modal.help : t.modal.then}</p>
        {!role && (
          <div className="grid gap-3">
            {DEMO_ROLES.map(r => (
              <button
                key={r.role}
                type="button"
                onClick={() => begin(r.role)}
                className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-forest-400 hover:bg-forest-50"
              >
                <p className="font-semibold text-ink-900">{lang === 'hi' ? ROLE_HI[r.role].label : r.label}</p>
                <p className="mt-1 text-sm text-ink-500">{lang === 'hi' ? ROLE_HI[r.role].hint : r.hint}</p>
              </button>
            ))}
          </div>
        )}
        {role && (
          <form
            className="space-y-5"
            onSubmit={e => {
              e.preventDefault();
              finish();
            }}
          >
            {questions.map((q, i) => (
              <fieldset key={q.id}>
                <legend className="text-sm font-semibold text-ink-900">
                  {i + 1}. {q.label}
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        answers[q.id] === opt
                          ? 'border-forest-600 bg-forest-600 text-white'
                          : 'border-slate-200 bg-white text-ink-700 hover:border-forest-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setRole(null);
                  setAnswers({});
                }}
              >
                {t.modal.back}
              </button>
              <button type="submit" className="btn-primary flex-1" disabled={!complete}>
                {t.modal.continue}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <SiteNav
        onGetStarted={() => {
          setRole(null);
          setAnswers({});
          setOpen(true);
        }}
      />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <img
              src="/ayurveda-hero.jpg"
              alt=""
              className="h-full w-full object-cover object-[center_38%] opacity-[0.68]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,246,240,0.70)_0%,_rgba(250,246,240,0.42)_50%,_rgba(250,246,240,0.18)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-cream-100/25 via-transparent to-cream-100" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-16 text-center sm:pt-20">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex rounded-full bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-700"
            >
              {t.hero.badge}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-5xl"
            >
              {t.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-500"
            >
              {t.hero.body}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setRole(null);
                  setAnswers({});
                  setOpen(true);
                }}
              >
                {t.hero.getStarted} <ArrowRight size={16} />
              </button>
              <a href="#how-it-works" className="btn-secondary">
                {t.hero.how}
              </a>
            </motion.div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-ink-500">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-forest-600" /> {t.hero.consent}
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-forest-600" /> {t.hero.verified}
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mx-auto max-w-xl px-4 pb-16"
          >
            <LiveMatchCard />
          </motion.div>
        </section>

        <section className="border-y border-slate-200 bg-white py-10">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4">
            {t.stats.map(s => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-bold text-forest-800 sm:text-3xl">{s.n}</p>
                <p className="mt-1 text-xs font-medium text-ink-500 sm:text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="partners" className="scroll-mt-24 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-saffron-600">{t.partners.kicker}</p>
            <h2 className="mt-2 text-center text-lg font-bold text-ink-900 sm:text-xl">{t.partners.title}</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {PARTNERS.map(p => (
                <article key={p.ab} className="card flex flex-col items-center px-3 py-4 text-center">
                  <span className="text-sm font-bold tracking-wide text-forest-800">{p.ab}</span>
                  <span className="mt-1 line-clamp-2 text-[11px] leading-snug text-ink-500">{p.name}</span>
                  <span className="mt-1 text-[10px] text-ink-500">{p.city}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="for-you" className="scroll-mt-24 border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">{t.audience.kicker}</p>
              <h2 className="mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">{t.audience.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{t.audience.subtitle}</p>
            </div>
            <div className="mx-auto mt-8 flex max-w-xl justify-center gap-2">
              {t.audience.tabs.map(x => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setTab(x.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    tab === x.id ? 'bg-forest-700 text-white shadow' : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <motion.div key={audience.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-8 max-w-2xl card p-8">
              <h3 className="text-lg font-bold text-ink-900">{audience.heading}</h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-700">
                {audience.points.map(p => (
                  <li key={p} className="flex gap-2">
                    <BadgeCheck size={18} className="mt-0.5 shrink-0 text-forest-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{t.how.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{t.how.subtitle}</p>
            </div>
            <ol className="mt-10 grid gap-4 sm:grid-cols-5">
              {t.how.steps.map((s, i) => (
                <motion.li
                  key={s.t}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="card p-5 text-center sm:text-left"
                >
                  <span className="text-xs font-bold text-forest-600">0{i + 1}</span>
                  <p className="mt-2 font-semibold text-ink-900">{s.t}</p>
                  <p className="mt-1 text-sm text-ink-500">{s.b}</p>
                </motion.li>
              ))}
            </ol>
            <p className="mt-8 text-center">
              <Link to="/about" className="text-sm font-semibold text-forest-700 hover:underline">
                {t.footer.about} →
              </Link>
            </p>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{t.features.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{t.features.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.features.items.map((p, i) => {
                const Icon = FEATURE_ICONS[i] ?? Brain;
                return (
                  <motion.article
                    key={p.t}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="card-hover p-6"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 font-semibold text-ink-900">{p.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.b}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pathways" className="scroll-mt-24 py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{t.pathways.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{t.pathways.body}</p>
              <ul className="mt-6 space-y-3 text-sm text-ink-700">
                {t.pathways.points.map(p => (
                  <li key={p} className="flex gap-2">
                    <BadgeCheck size={18} className="mt-0.5 shrink-0 text-forest-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">{t.pathways.sample}</p>
              {[
                { n: 'Yoga therapy', v: 88 },
                { n: 'Panchakarma protocols', v: 78 },
                { n: 'Clinical documentation', v: 54 },
              ].map(s => (
                <div key={s.n} className="mt-4">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{s.n}</span>
                    <span className="font-semibold text-forest-700">{s.v}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-forest-600" style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workspaces" className="scroll-mt-24 border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{t.workspaces.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{t.workspaces.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DEMO_ROLES.map(r => (
                <button key={r.role} type="button" onClick={() => begin(r.role)} className="card-hover p-6 text-left">
                  <p className="text-lg font-bold text-forest-800">{lang === 'hi' ? ROLE_HI[r.role].label : r.label}</p>
                  <p className="mt-1 text-sm text-ink-500">{lang === 'hi' ? ROLE_HI[r.role].hint : r.hint}</p>
                  <p className="mt-4 text-sm font-semibold text-forest-600">{t.workspaces.start}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

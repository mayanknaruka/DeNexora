import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SiteNav } from '../../components/layout/SiteNav';
import { SiteFooter } from '../../components/layout/SiteFooter';
import { GraduationCap, Building2, Briefcase, School, Shield } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'student' as const,
    label: 'Student',
    email: 'student@demo.com',
    password: '123456',
    icon: GraduationCap,
    description: 'View internships, apply, track applications',
  },
  {
    role: 'academician' as const,
    label: 'Faculty',
    email: 'faculty@demo.com',
    password: '123456',
    icon: School,
    description: 'FDP programs, research collaboration',
  },
  {
    role: 'industry' as const,
    label: 'Industry',
    email: 'industry@demo.com',
    password: '123456',
    icon: Briefcase,
    description: 'Post opportunities, manage applicants',
  },
  {
    role: 'institution' as const,
    label: 'Institution',
    email: 'institution@demo.com',
    password: '123456',
    icon: Building2,
    description: 'Student analytics, placement tracking',
  },
  {
    role: 'admin' as const,
    label: 'Ministry Admin',
    email: 'admin@demo.com',
    password: '123456',
    icon: Shield,
    description: 'National dashboard, system management',
  },
];

export default function LoginPage() {
  const { login, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if it matches any demo account
    const demoAccount = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
    );

    if (demoAccount) {
      // Use demo login
      try {
        enterDemo(demoAccount.role);
        // Small delay for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        navigate('/dashboard');
      } catch (err) {
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Otherwise try real backend login
    try {
      await login(email, password);
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Try one of the accounts on the right.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (account: typeof DEMO_ACCOUNTS[number]) => {
    setLoading(true);
    setError('');
    try {
      enterDemo(account.role);
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <SiteNav />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          {/* Logo at top center */}
          <div className="mb-8 flex justify-center">
            <img src="/ayush-logo.png" alt="Ministry of Ayush" className="h-20 w-auto object-contain" />
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Login Form */}
            <div className="card p-8">
              <h1 className="text-2xl font-bold text-ink-900">Sign in</h1>
              <p className="mt-1 text-sm text-ink-500">Access your AyuSetu workspace</p>
              {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</div>}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">
                    Email
                  </label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-700">
                    Password
                  </label>
                  <input
                    id="password"
                    className="input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-ink-500">
                New?{' '}
                <Link to="/register" className="font-semibold text-forest-700 hover:text-forest-800">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Quick Access Accounts */}
            <div className="card p-8">
              <h2 className="text-xl font-bold text-ink-900">Quick Access</h2>
              <p className="mt-1 text-sm text-ink-500">Login as different user types</p>
              <div className="mt-6 space-y-3">
                {DEMO_ACCOUNTS.map(account => {
                  const Icon = account.icon;
                  return (
                    <button
                      key={account.role}
                      onClick={() => handleQuickLogin(account)}
                      className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-forest-300 hover:bg-forest-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-100 text-forest-700">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-ink-900">{account.label}</h3>
                        <p className="mt-0.5 text-xs text-ink-500">{account.description}</p>
                        <p className="mt-2 font-mono text-xs text-ink-400">
                          {account.email} / {account.password}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

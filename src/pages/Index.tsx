import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function Index() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated && user) {
    if (user.role === 'admin' || user.role === 'dev') {
      navigate('/admin');
      return null;
    }
    // Show logged-in hero
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
    </div>
  );
}

function HeroSection() {
  const { user, isAuthenticated } = useAuth();

  return (
    <section className="bg-navy min-h-[85vh] flex items-center">
      <div className="container mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left column */}
        <div>
          <span className="font-mono text-deep-teal text-[11px] uppercase tracking-[0.2em]">
            Waikato DHB Sleep Service
          </span>
          <h1 className="font-heading text-navy-foreground text-4xl md:text-[60px] leading-[1.1] mt-4 mb-6">
            Your CPAP care,<br />
            <em className="text-seafoam">all in one place.</em>
          </h1>
          <p className="font-body text-navy-foreground/80 text-lg max-w-md mb-8">
            Check your equipment, see if you can reorder, and manage your supplies — without calling us.
          </p>

          {isAuthenticated && user ? (
            <LoggedInCard user={user} />
          ) : (
            <>
              <Button variant="hero" size="xl" onClick={() => document.getElementById('login-card')?.scrollIntoView({ behavior: 'smooth' })} className="lg:hidden mb-8">
                Log In to My Account →
              </Button>
              <div className="space-y-2 text-navy-foreground/60 text-sm font-body">
                <p>✓ Calling to check your machine model</p>
                <p>✓ Calling to check if you can reorder</p>
                <p>✓ Calling to find out your mask size</p>
              </div>
            </>
          )}
        </div>

        {/* Right column */}
        <div id="login-card">
          {isAuthenticated && user ? (
            <div /> // Card already shown inline on mobile
          ) : (
            <LoginCard />
          )}
        </div>
      </div>
    </section>
  );
}

function LoginCard() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(identifier, password);
    if (result.success) {
      // Auth context will re-render, useEffect in parent checks role
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="bg-navy-foreground/10 backdrop-blur-md border border-navy-foreground/20 rounded-2xl p-8 max-w-md mx-auto">
      <span className="font-mono text-deep-teal text-[11px] uppercase tracking-[0.2em]">
        Patient Login
      </span>
      <h2 className="font-heading text-navy-foreground text-[28px] mt-2 mb-6">Log In</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="e.g. 238872 or name@email.com"
            className="w-full bg-navy-foreground/10 border border-navy-foreground/20 rounded-xl px-4 py-3 text-navy-foreground placeholder:text-navy-foreground/40 font-body text-sm focus:outline-none focus:border-deep-teal transition-colors"
          />
          <p className="text-navy-foreground/40 text-xs mt-1 font-body">Your Portal ID is on your welcome letter</p>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-navy-foreground/10 border border-navy-foreground/20 rounded-xl px-4 py-3 text-navy-foreground placeholder:text-navy-foreground/40 font-body text-sm focus:outline-none focus:border-deep-teal transition-colors pr-12"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-foreground/40 hover:text-navy-foreground/70">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="text-destructive text-sm font-body">{error}</p>}

        <Button type="submit" variant="hero" className="w-full" size="lg">
          Log In Securely →
        </Button>
      </form>

      <div className="mt-4 space-y-1">
        <p className="text-navy-foreground/60 text-xs font-body">Forgot your Portal ID? Contact the clinic →</p>
        <p className="text-navy-foreground/40 text-xs font-body">Forgot password?</p>
      </div>
      <p className="text-navy-foreground/30 text-[11px] mt-6 font-body leading-relaxed">
        Data stored securely in New Zealand under the Health Information Privacy Code 2020.
      </p>
    </div>
  );
}

function LoggedInCard({ user }: { user: NonNullable<ReturnType<typeof useAuth>['user']> }) {
  const navigate = useNavigate();
  return (
    <div className="bg-navy-foreground/10 backdrop-blur-md border border-navy-foreground/20 rounded-2xl p-8 max-w-md">
      <h3 className="font-heading text-navy-foreground text-2xl mb-2">Welcome back, {user.firstName}</h3>
      <p className="text-navy-foreground/70 font-body text-sm mb-4">Your machine: {user.equipment.machineName}</p>
      <div className="mb-6">
        {user.entitlementStatus === 'eligible' ? (
          <span className="inline-flex items-center gap-1.5 bg-seafoam/20 text-seafoam px-3 py-1.5 rounded-full text-sm font-mono">
            ✓ Eligible to order supplies
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-navy-foreground/10 text-navy-foreground/60 px-3 py-1.5 rounded-full text-sm font-mono">
            Next order available in 3 months
          </span>
        )}
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button variant="hero" size="default" onClick={() => navigate('/dashboard')}>View My Dashboard →</Button>
        <Button variant="outline" size="default" onClick={() => navigate('/reorder')} className="border-navy-foreground/30 text-navy-foreground hover:bg-navy-foreground/10">
          Reorder Supplies →
        </Button>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Log in', desc: 'Use your 6-digit Patient Portal ID or email. No health identifiers on the front door.' },
    { num: '02', title: 'See your details', desc: 'Your machine model, mask size, issue date, and whether you\'re eligible to reorder — in seconds.' },
    { num: '03', title: 'Order and go', desc: 'Select your approved supplies and we\'ll courier them. No calls. No waiting.' },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="font-heading text-navy text-3xl md:text-4xl text-center mb-4">Simple. Secure. Self-Service.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {steps.map(s => (
            <div key={s.num} className="bg-card rounded-2xl p-8 border border-sand/50 shadow-sm">
              <span className="font-mono text-deep-teal text-sm">{s.num}</span>
              <h3 className="font-heading text-navy text-2xl mt-2 mb-3">{s.title}</h3>
              <p className="font-body text-foreground/70 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
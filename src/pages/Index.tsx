import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, HelpCircle, MonitorCheck, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';

export default function Index() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && user?.role === 'patient') navigate('/portal/dashboard');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = login(identifier, password);
    if (result.success) navigate('/portal/dashboard');
    else setError(result.error ?? 'Please check your details.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_420px] md:px-8 md:py-20">
        <section className="flex flex-col justify-center">
          <p className="font-mono text-xs uppercase tracking-wider text-deep-teal">Waikato, New Zealand</p>
          <h1 className="mt-3 font-heading text-5xl leading-tight text-navy md:text-6xl">Midland Sleep Patient Portal</h1>
          <p className="mt-4 max-w-xl font-body text-lg text-muted-foreground">Check your CPAP equipment and request supplies</p>
          <div className="mt-10 grid gap-4">
            {[
              { icon: MonitorCheck, text: 'See what CPAP equipment you have' },
              { icon: ClipboardCheck, text: 'Find out if you can request supplies' },
              { icon: HelpCircle, text: 'Check when maintenance is due' },
            ].map((item) => <div key={item.text} className="flex items-center gap-3 font-body text-foreground"><item.icon className="h-5 w-5 text-seafoam" />{item.text}</div>)}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-6 shadow-sm md:p-8">
          <h2 className="font-heading text-3xl text-navy">Log In</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block"><span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Portal ID or Email</span><input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-2 w-full rounded-full bg-muted/40 px-4 py-3 font-body outline-none focus:ring-2 focus:ring-deep-teal" /></label>
            <label className="block"><span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Password</span><span className="relative mt-2 block"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-full bg-muted/40 px-4 py-3 pr-12 font-body outline-none focus:ring-2 focus:ring-deep-teal" /><button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>
            {error && <p className="font-body text-sm text-amber-foreground">{error}</p>}
            <Button type="submit" className="w-full" size="lg">Log In →</Button>
          </form>
          <div className="mt-5 flex justify-center gap-4 font-body text-sm text-deep-teal"><button>Set up my account</button><span className="text-sand">|</span><button>Forgot my details</button></div>
        </section>
      </main>
      <footer className="px-4 py-8 text-center font-body text-sm text-muted-foreground">Midland Sleep Ltd | 0800 XXX XXX</footer>
    </div>
  );
}

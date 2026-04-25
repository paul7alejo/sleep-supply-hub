import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { getAllPatients } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';

const patients = getAllPatients();

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!isAuthenticated) navigate('/'); if (user?.role === 'patient') navigate('/portal/dashboard'); }, [isAuthenticated, user, navigate]);
  if (!user) return null;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <h1 className="font-heading text-4xl text-navy">Prototype Admin View</h1>
        <p className="mt-2 font-body text-muted-foreground">Operational snapshot for the visual prototype.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label="Active patients" value="4,500" />
          <Metric label="Likely portal users" value="2,500" />
          <Metric label="Support queue" value="4" />
        </div>
        <section className="mt-8 rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-heading text-2xl text-navy">Demo patients</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"><tr><th className="py-3">Name</th><th>MPID</th><th>Machine</th><th>Supplies</th><th>Safety</th></tr></thead>
              <tbody>{patients.map((patient) => <tr key={patient.id} className="border-t border-muted"><td className="py-3">{patient.name}</td><td className="font-mono">{patient.portalId}</td><td>{patient.machine.name}</td><td>{patient.eligibilityStatus === 'eligible' ? 'Yes' : 'No'}</td><td className={patient.machine.safetyStatus === 'overdue' ? 'text-amber-foreground' : 'text-seafoam-foreground'}>{patient.machine.safetyStatus === 'overdue' ? 'Overdue' : 'Not due'}</td></tr>)}</tbody>
            </table>
          </div>
          <Button className="mt-6" onClick={() => navigate('/portal/dashboard')}>Open Patient Portal →</Button>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-card p-6 shadow-sm"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 font-heading text-4xl text-navy">{value}</p></div>; }

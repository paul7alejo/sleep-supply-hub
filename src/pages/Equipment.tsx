import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalLayout } from '@/components/PortalLayout';
import { useAuth } from '@/context/AuthContext';

export default function Equipment() {
  const { user, isAuthenticated } = useAuth(); const navigate = useNavigate();
  useEffect(() => { if (!isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  if (!user) return null;
  return <PortalLayout><h1 className="font-heading text-4xl text-navy md:text-5xl">My Equipment</h1><div className="mt-8 grid gap-6 md:grid-cols-2">{user.equipmentHistory.map((item) => <section key={`${item.type}-${item.date}`} className="rounded-2xl bg-card p-6 shadow-sm"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{item.type}</p><h2 className="mt-2 font-heading text-2xl text-navy">{item.name}</h2><p className="mt-3 font-body text-muted-foreground">Issued {item.date}</p><span className="mt-4 inline-flex rounded-full bg-seafoam/15 px-3 py-1 font-mono text-xs text-seafoam-foreground">{item.status}</span></section>)}</div><section className="mt-6 rounded-2xl bg-card p-6 shadow-sm"><h2 className="font-heading text-2xl text-navy">Maintenance timeline</h2><div className="mt-5 space-y-4">{user.maintenanceTimeline.map((item) => <div key={`${item.date}-${item.title}`} className="flex gap-4"><span className={`mt-1 h-3 w-3 rounded-full ${item.status === 'overdue' ? 'bg-amber' : item.status === 'complete' ? 'bg-seafoam' : 'bg-deep-teal'}`} /><div><p className="font-body font-medium text-foreground">{item.title}</p><p className="font-mono text-xs text-muted-foreground">{item.date}</p></div></div>)}</div></section></PortalLayout>;
}

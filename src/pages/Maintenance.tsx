import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalLayout } from '@/components/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/data/demoData';

export default function Maintenance() {
  const { user, isAuthenticated } = useAuth(); const navigate = useNavigate();
  useEffect(() => { if (!isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  if (!user) return null;
  const cards = [{ title: 'Safety check', value: formatDate(user.machine.safetyDue), detail: `Last done ${formatDate(user.machine.lastSafetyCheck)}`, warn: user.machine.safetyStatus === 'overdue' }, { title: 'Warranty', value: formatDate(user.machine.warrantyExpiry), detail: 'Warranty record for current device', warn: false }, { title: 'Water chamber', value: formatDate(user.waterChamber.nextDue), detail: `Last replaced ${formatDate(user.waterChamber.lastReplaced)}`, warn: user.waterChamber.status === 'due' }];
  return <PortalLayout><h1 className="font-heading text-4xl text-navy md:text-5xl">Maintenance</h1><div className="mt-8 grid gap-6 md:grid-cols-3">{cards.map((card) => <section key={card.title} className="rounded-2xl bg-card p-6 shadow-sm"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{card.title}</p><h2 className="mt-3 font-heading text-2xl text-navy">{card.value}</h2><p className="mt-2 font-body text-sm text-muted-foreground">{card.detail}</p>{card.warn && <span className="mt-4 inline-flex rounded-full bg-amber/15 px-3 py-1 font-mono text-xs text-amber-foreground">OVERDUE</span>}</section>)}</div><section className="mt-6 rounded-2xl bg-card p-6 shadow-sm"><h2 className="font-heading text-2xl text-navy">Timeline</h2><div className="mt-5 space-y-4">{user.maintenanceTimeline.map((item) => <div key={item.title} className="flex items-center justify-between gap-4 border-b border-muted/60 py-3 last:border-0"><span className="font-body text-foreground">{item.title}</span><span className="font-mono text-xs text-muted-foreground">{item.date}</span></div>)}</div></section></PortalLayout>;
}

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { PortalLayout } from '@/components/PortalLayout';
import { formatDate } from '@/data/demoData';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  if (!user) return null;
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <PortalLayout>
      <h1 className="font-heading text-4xl text-navy md:text-5xl">{greeting}, {user.firstName}.</h1>
      <div className="mt-8 grid gap-6">
        <section className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-heading text-2xl text-navy">My Equipment</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Info label="Machine" value={user.machine.name} /><Info label="Device ID" value={user.machine.deviceId} mono /><Info label="Issued" value={formatDate(user.machine.issued)} /><Info label="Warranty" value={`Active until ${formatDate(user.machine.warrantyExpiry)}`} />
            <Status label="Safety check" overdue={user.machine.safetyStatus === 'overdue'} text={user.machine.safetyStatus === 'overdue' ? `DUE ${new Date(user.machine.safetyDue).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' }).toUpperCase()}` : `Not due until ${formatDate(user.machine.safetyDue)}`} />
            <Status label="Water chamber" overdue={user.waterChamber.status === 'due'} text={user.waterChamber.status === 'due' ? 'Due for replacement' : 'OK'} />
            <Info label="Mask" value={user.mask.name} /><Info label="Size" value={user.mask.size} /><Info label="Last issued" value={formatDate(user.mask.lastIssued)} />
          </div>
        </section>
        <section className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-heading text-2xl text-navy">My Supplies Status</h2>
          {user.eligibilityStatus === 'eligible' ? <div className="mt-4 rounded-2xl bg-seafoam/15 p-5"><p className="font-body font-medium text-seafoam-foreground">✅ You can request mask supplies</p><Button className="mt-4" onClick={() => navigate('/portal/reorder')}>Request Supplies →</Button></div> : <div className="mt-4 rounded-2xl bg-muted/45 p-5"><p className="font-body font-medium text-muted-foreground">⏳ {user.eligibleText}</p></div>}
        </section>
        <section className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4"><h2 className="font-heading text-2xl text-navy">Recent Orders</h2><Link to="/portal/profile" className="font-body text-sm text-deep-teal">View all orders →</Link></div>
          <div className="mt-4 divide-y divide-muted/70">{user.orders.slice(0, 3).map((order) => <div key={order.id} className="grid gap-2 py-3 font-body text-sm md:grid-cols-[160px_1fr_130px]"><span className="font-mono text-muted-foreground">{formatDate(order.date)}</span><span>{order.items}</span><span className="capitalize text-deep-teal">{order.status}</span></div>)}</div>
        </section>
      </div>
    </PortalLayout>
  );
}
function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) { return <div><p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p><p className={mono ? 'font-mono text-foreground' : 'font-body text-foreground'}>{value}</p></div>; }
function Status({ label, text, overdue }: { label: string; text: string; overdue: boolean }) { return <div><p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p><p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-body text-sm ${overdue ? 'bg-amber/15 text-amber-foreground' : 'bg-seafoam/15 text-seafoam-foreground'}`}>{overdue ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{text}</p></div>; }

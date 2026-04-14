import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';

export default function Account() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'details' | 'orders' | 'equipment'>('details');
  const [nhiRevealed, setNhiRevealed] = useState(false);
  const [nhiTimer, setNhiTimer] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (nhiRevealed && nhiTimer > 0) {
      const t = setTimeout(() => setNhiTimer(nhiTimer - 1), 1000);
      return () => clearTimeout(t);
    }
    if (nhiTimer === 0 && nhiRevealed) {
      setNhiRevealed(false);
    }
  }, [nhiRevealed, nhiTimer]);

  if (!user) return null;

  const maskNhi = (nhi: string) => nhi.substring(0, 3) + ' ****';

  const revealNhi = () => {
    setNhiRevealed(true);
    setNhiTimer(30);
  };

  const tabs = [
    { key: 'details' as const, label: 'My Details' },
    { key: 'orders' as const, label: 'My Orders' },
    { key: 'equipment' as const, label: 'My Equipment History' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
        <h1 className="font-heading text-navy text-3xl mb-6">My Account</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-sand/50">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 font-body text-sm transition-colors ${
                tab === t.key
                  ? 'text-deep-teal border-b-2 border-deep-teal font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'details' && (
          <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <Detail label="Name" value={user.name} />
              <Detail label="Portal ID" value={user.portalId} mono />
              <Detail label="Email" value={user.email} />
              <Detail label="Phone" value={user.phone} />
              <Detail label="Address" value={`${user.address}, ${user.suburb}, ${user.city} ${user.postcode}`} />
              <Detail label="GP" value={`${user.gpName} — ${user.gpPractice}`} />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 mb-1">NHI</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-foreground text-sm">
                    {nhiRevealed ? user.nhi : maskNhi(user.nhi)}
                  </span>
                  {nhiRevealed ? (
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-deep-teal transition-all" style={{ width: `${(nhiTimer / 30) * 100}%` }} />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{nhiTimer}s</span>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={revealNhi}>
                      Reveal for 30 seconds
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-sand/50">
              <p className="font-body text-foreground/50 text-sm">To update details, contact Midland:</p>
              <div className="flex gap-3 mt-2">
                <Button variant="outline" size="sm">Call: 0800 XXX XXX</Button>
                <Button variant="outline" size="sm">Email Us</Button>
              </div>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
            {user.orders.length === 0 ? (
              <p className="font-body text-muted-foreground text-sm">No orders yet. Contact Midland if you need supplies.</p>
            ) : (
              <div className="space-y-3">
                {user.orders.map(o => (
                  <div key={o.id} className="flex items-center justify-between py-3 border-b border-sand/30 last:border-0">
                    <div>
                      <p className="font-body text-foreground text-sm font-medium">{o.product}</p>
                      <p className="font-mono text-muted-foreground text-xs">{formatDate(o.date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={o.status} />
                      <Button variant="outline" size="sm" onClick={() => navigate('/reorder')}>Reorder</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'equipment' && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
              <h3 className="font-heading text-navy text-lg mb-4">Machines</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Detail label="Model" value={user.equipment.machineName} />
                <Detail label="Issued" value={formatDate(user.equipment.machineIssued)} />
                <Detail label="Warranty Expiry" value={formatDate(user.equipment.warrantyExpiry)} />
                <Detail label="Status" value="Active" />
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
              <h3 className="font-heading text-navy text-lg mb-4">Mask Kits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Detail label="Kit" value={user.equipment.maskName} />
                <Detail label="Size" value={user.equipment.maskSize} />
                <Detail label="Issued" value={formatDate(user.equipment.lastMaskReplaced)} />
                <Detail label="Last Replaced" value={formatDate(user.equipment.lastMaskReplaced)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 mb-1">{label}</p>
      <p className={`text-sm text-foreground ${mono ? 'font-mono' : 'font-body'}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: 'bg-amber/15 text-amber-foreground',
    Dispatched: 'bg-deep-teal/15 text-deep-teal',
    Delivered: 'bg-seafoam/15 text-seafoam-foreground',
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-mono ${styles[status] || ''}`}>{status}</span>;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' });
}
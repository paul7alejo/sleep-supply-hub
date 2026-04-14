import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Package, HeadphonesIcon, ClipboardList, User, ChevronDown, ChevronUp } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpReason, setHelpReason] = useState('');
  const [helpOther, setHelpOther] = useState('');
  const [helpSent, setHelpSent] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
    if (user?.role === 'admin' || user?.role === 'dev') navigate('/admin');
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  const eq = user.equipment;
  const now = new Date();
  const warrantyDate = new Date(eq.warrantyExpiry);
  const warrantyMonths = Math.round((warrantyDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const elecCheckDate = new Date(new Date(eq.machineIssued).getTime() + 3 * 365 * 24 * 60 * 60 * 1000);
  const elecMonths = Math.round((elecCheckDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const waterDate = new Date(eq.waterChamberReplaced);
  const waterMonths = Math.round((now.getTime() - waterDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  const helpReasons = [
    'My mask doesn\'t fit properly',
    'My machine is making unusual sounds',
    'I\'m having trouble sleeping with CPAP',
    'My order hasn\'t arrived yet',
    'Something else',
  ];

  const handleHelpSubmit = () => {
    setHelpSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banners */}
      {elecMonths < 0 && (
        <div className="bg-destructive/10 border-l-4 border-destructive px-6 py-3 text-sm font-body text-destructive">
          ⚠ ELECTRICAL CHECK OVERDUE — Contact Midland to arrange
        </div>
      )}
      {warrantyMonths <= 3 && warrantyMonths > 0 && (
        <div className="bg-amber/10 border-l-4 border-amber px-6 py-3 text-sm font-body text-amber-foreground">
          ⚠ Your machine warranty expires soon
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl">
        <h1 className="font-heading text-navy text-3xl mb-1">{greeting}, {user.firstName}.</h1>
        <p className="font-body text-muted-foreground mb-8">Here's your CPAP care summary.</p>

        {/* Equipment */}
        <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6 mb-6">
          <h2 className="font-heading text-navy text-xl mb-4">My Equipment</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Machine */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">My CPAP Machine</h3>
              <p className="font-body text-foreground font-medium">{eq.machineName}</p>
              <p className="font-body text-muted-foreground text-sm">Issued: {formatDate(eq.machineIssued)}</p>

              <div className="mt-3 space-y-2">
                {warrantyMonths > 3 ? (
                  <Badge variant="seafoam">✓ Warranty active — expires {formatDate(eq.warrantyExpiry)}</Badge>
                ) : warrantyMonths > 0 ? (
                  <Badge variant="amber">⚠ Warranty expires soon — {formatDate(eq.warrantyExpiry)}</Badge>
                ) : (
                  <Badge variant="red">✗ Warranty expired</Badge>
                )}

                {elecMonths > 3 ? (
                  <p className="text-sm text-muted-foreground">Next electrical check: {formatDate(elecCheckDate.toISOString())}</p>
                ) : elecMonths > 0 ? (
                  <Badge variant="amber">⚠ Electrical check due soon</Badge>
                ) : (
                  <Badge variant="red">⚠ ELECTRICAL CHECK OVERDUE</Badge>
                )}
                <p className="text-xs text-muted-foreground">Required every 3 years by NZ electrical safety standards.</p>
              </div>
            </div>

            {/* Mask */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">My Mask & Kit</h3>
              <p className="font-body text-foreground font-medium">{eq.maskName}</p>
              <p className="font-body text-muted-foreground text-sm">Size: {eq.maskSize}</p>
              <p className="font-body text-muted-foreground text-sm">Cushion: {eq.cushionName}</p>
              <p className="font-body text-muted-foreground text-sm">Last replaced: {formatDate(eq.lastMaskReplaced)}</p>

              <div className="mt-3">
                {waterMonths <= 6 ? (
                  <p className="text-sm text-muted-foreground">Water chamber ok — replaced {formatDate(eq.waterChamberReplaced)}</p>
                ) : (
                  <Badge variant="amber">⚠ Water chamber due for replacement</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Entitlement */}
        <div className={`rounded-2xl p-6 mb-6 border-l-4 ${
          user.entitlementStatus === 'eligible'
            ? 'bg-deep-teal-pale border-deep-teal'
            : 'bg-card border-sand'
        }`}>
          {user.entitlementStatus === 'eligible' ? (
            <>
              <p className="font-body text-foreground font-medium">✓ You are eligible to order supplies</p>
              <p className="font-body text-muted-foreground text-sm mt-1">Headgear, cushions, and mask accessories available.</p>
              <Button className="mt-4" onClick={() => navigate('/reorder')}>Reorder My Supplies →</Button>
            </>
          ) : user.entitlementStatus === 'not_eligible' ? (
            <>
              <p className="font-body text-foreground font-medium">Your next order is available in 3 months</p>
              <p className="font-body text-muted-foreground text-sm mt-1">Supplies were last ordered {formatDate(user.lastOrderDate)}.</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/account')}>View My Orders →</Button>
            </>
          ) : (
            <>
              <p className="font-body text-foreground font-medium">Contact Midland to confirm your entitlement.</p>
              <Button variant="outline" className="mt-4">Contact Us →</Button>
            </>
          )}
        </div>

        {/* Recent Orders */}
        {user.orders.length > 0 && (
          <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6 mb-6">
            <h2 className="font-heading text-navy text-xl mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {user.orders.slice(0, 3).map(o => (
                <div key={o.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-body text-foreground text-sm font-medium">{o.product}</p>
                    <p className="font-mono text-muted-foreground text-xs">{formatDate(o.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={o.status === 'Delivered' ? 'seafoam' : o.status === 'Processing' ? 'amber' : 'teal'}>
                      {o.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => navigate('/reorder')}>Reorder →</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <QuickAction icon={<Package size={20} />} label="Reorder Supplies" onClick={() => navigate('/reorder')} />
          <QuickAction icon={<HeadphonesIcon size={20} />} label="Get Help with my CPAP" onClick={() => setHelpOpen(!helpOpen)} />
          <QuickAction icon={<ClipboardList size={20} />} label="My Orders" onClick={() => navigate('/account')} />
          <QuickAction icon={<User size={20} />} label="My Profile" onClick={() => navigate('/account')} />
        </div>

        {/* Help Panel */}
        {helpOpen && (
          <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6 mb-6">
            {helpSent ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-seafoam/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-seafoam text-2xl">✓</span>
                </div>
                <p className="font-body text-foreground font-medium">We will call you within 1 business day</p>
                <p className="font-body text-muted-foreground text-sm mt-1">We will use: {user.phone}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => { setHelpOpen(false); setHelpSent(false); setHelpReason(''); }}>Close</Button>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-navy text-xl mb-1">What do you need help with?</h3>
                <p className="font-body text-muted-foreground text-sm mb-4">A team member will call you within 1 business day.</p>
                <div className="space-y-2 mb-4">
                  {helpReasons.map(r => (
                    <label key={r} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                      <input type="radio" name="helpReason" value={r} checked={helpReason === r} onChange={() => setHelpReason(r)} className="accent-deep-teal" />
                      <span className="font-body text-sm text-foreground">{r}</span>
                    </label>
                  ))}
                </div>
                {helpReason === 'Something else' && (
                  <input
                    type="text" placeholder="Briefly describe what you need help with..."
                    value={helpOther} onChange={e => setHelpOther(e.target.value)}
                    className="w-full bg-muted/30 border-b-2 border-sand px-4 py-3 font-body text-sm focus:outline-none focus:border-deep-teal mb-4"
                  />
                )}
                <Button onClick={handleHelpSubmit} disabled={!helpReason} className="w-full">Send Help Request →</Button>
                <button onClick={() => setHelpOpen(false)} className="block mx-auto mt-3 text-sm text-muted-foreground font-body">Cancel</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-card rounded-2xl border border-sand/50 shadow-sm p-4 flex flex-col items-center gap-2 hover:border-deep-teal/30 transition-colors group">
      <span className="text-deep-teal group-hover:text-deep-teal/80">{icon}</span>
      <span className="font-body text-xs text-foreground text-center">{label}</span>
    </button>
  );
}

function Badge({ variant, children }: { variant: 'seafoam' | 'amber' | 'red' | 'teal'; children: React.ReactNode }) {
  const styles = {
    seafoam: 'bg-seafoam/15 text-seafoam-foreground',
    amber: 'bg-amber/15 text-amber-foreground',
    red: 'bg-destructive/15 text-destructive',
    teal: 'bg-deep-teal/15 text-deep-teal',
  };
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono ${styles[variant]}`}>{children}</span>;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' });
}
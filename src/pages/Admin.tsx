import { useAuth, getAllPatients, type User } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';

const patients = getAllPatients();

// Mock data
const ordersPerMonth = [
  { month: 'May', orders: 145 }, { month: 'Jun', orders: 162 }, { month: 'Jul', orders: 178 },
  { month: 'Aug', orders: 155 }, { month: 'Sep', orders: 190 }, { month: 'Oct', orders: 168 },
  { month: 'Nov', orders: 142 }, { month: 'Dec', orders: 120 }, { month: 'Jan', orders: 175 },
  { month: 'Feb', orders: 195 }, { month: 'Mar', orders: 201 }, { month: 'Apr', orders: 187 },
];

const loginActivity = [
  { month: 'May', logins: 820 }, { month: 'Jun', logins: 950 }, { month: 'Jul', logins: 1100 },
  { month: 'Aug', logins: 1250 }, { month: 'Sep', logins: 1380 }, { month: 'Oct', logins: 1420 },
  { month: 'Nov', logins: 1350 }, { month: 'Dec', logins: 1180 }, { month: 'Jan', logins: 1500 },
  { month: 'Feb', logins: 1620 }, { month: 'Mar', logins: 1780 }, { month: 'Apr', logins: 1850 },
];

const supportContacts = [
  { month: 'May', contacts: 340 }, { month: 'Jun', contacts: 310 }, { month: 'Jul', contacts: 285 },
  { month: 'Aug', contacts: 260 }, { month: 'Sep', contacts: 230 }, { month: 'Oct', contacts: 210 },
  { month: 'Nov', contacts: 195 }, { month: 'Dec', contacts: 180 }, { month: 'Jan', contacts: 165 },
  { month: 'Feb', contacts: 148 }, { month: 'Mar', contacts: 132 }, { month: 'Apr', contacts: 118 },
];

const topProducts = [
  { name: 'AirFit F30i Cushion — Small', count: 67 },
  { name: 'AirFit P10 Nasal Pillow — XS', count: 43 },
  { name: 'DreamWear Cushion — Medium', count: 31 },
  { name: 'AirFit F30i Headgear', count: 28 },
  { name: 'AirFit P10 Headgear', count: 19 },
];

const stockItems = [
  { name: 'AirFit F30i Cushion — Small', units: 147, status: 'ok' },
  { name: 'AirFit F30i Headgear', units: 89, status: 'ok' },
  { name: 'DreamWear Cushion — Medium', units: 52, status: 'ok' },
  { name: 'AirFit P10 Pillow — XS', units: 38, status: 'low' },
  { name: 'AirFit F30i Cushion Clip', units: 24, status: 'reorder' },
];

const auditLog = [
  { action: 'Patient viewed', staff: 'admin@midlandsleep.co.nz', date: '14 Apr 09:32' },
  { action: 'NHI revealed', staff: 'admin@midlandsleep.co.nz', date: '14 Apr 09:33' },
  { action: 'Entitlement edited', staff: 'admin@midlandsleep.co.nz', date: '13 Apr 15:20' },
  { action: 'Data export', staff: 'admin@midlandsleep.co.nz', date: '12 Apr 11:00' },
  { action: 'Outreach sent (342)', staff: 'admin@midlandsleep.co.nz', date: '11 Apr 09:00' },
  { action: 'Admin login', staff: 'admin@midlandsleep.co.nz', date: '14 Apr 08:55' },
];

const supportQueue = [
  { patient: 'Paul Henderson', reason: 'Machine making unusual sounds', submitted: '14 Apr 08:20', priority: 'HIGH' as const },
  { patient: 'Sarah Mitchell', reason: 'Order hasn\'t arrived', submitted: '13 Apr 14:30', priority: 'MEDIUM' as const },
  { patient: 'Richard Tāmati', reason: 'Mask doesn\'t fit properly', submitted: '13 Apr 10:15', priority: 'MEDIUM' as const },
  { patient: 'Jane Smith', reason: 'Trouble sleeping with CPAP', submitted: '12 Apr 16:45', priority: 'LOW' as const },
];

type AdminTab = 'overview' | 'patients' | 'orders' | 'credits' | 'analytics' | 'audit';

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [patientFilter, setPatientFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [nhiRevealed, setNhiRevealed] = useState(false);
  const [nhiTimer, setNhiTimer] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [accessLogOpen, setAccessLogOpen] = useState(false);
  const [analyticsRange, setAnalyticsRange] = useState('12 months');

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
    if (user?.role === 'patient') navigate('/dashboard');
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (nhiRevealed && nhiTimer > 0) {
      const t = setTimeout(() => setNhiTimer(nhiTimer - 1), 1000);
      return () => clearTimeout(t);
    }
    if (nhiTimer === 0 && nhiRevealed) setNhiRevealed(false);
  }, [nhiRevealed, nhiTimer]);

  if (!user) return null;

  const tabs: { key: AdminTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'patients', label: 'Patients' },
    { key: 'orders', label: 'Orders' },
    { key: 'credits', label: 'Credits' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'audit', label: 'Audit Log' },
  ];

  const maskNhi = (nhi: string) => nhi.substring(0, 3) + '****';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 py-8">
        <h1 className="font-heading text-navy text-3xl mb-6">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto border-b border-sand/50">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSelectedPatient(null); }}
              className={`px-4 py-3 font-body text-sm whitespace-nowrap transition-colors ${
                tab === t.key ? 'text-deep-teal border-b-2 border-deep-teal font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard label="Active Patients" value="2,500" border="deep-teal" />
              <MetricCard label="Orders This Month" value="187" border="seafoam" />
              <MetricCard label="Pending Dispatch" value="12" border="amber" />
              <MetricCard label="Support Requests" value="4" border="deep-teal" />
              <MetricCard label="Inactive 18+ Months" value="342" border="amber" />
              <MetricCard label="Electrical Checks Overdue" value="89" border="destructive" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Electrical checks */}
              <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
                <h3 className="font-heading text-navy text-lg mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber rounded-full" />
                  Electrical Checks Due This Month
                </h3>
                <div className="space-y-3">
                  {patients.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm py-2">
                      <span className="font-body text-foreground">{p.name}</span>
                      <span className="font-mono text-muted-foreground text-xs">{p.equipment.machineName}</span>
                      <Button variant="outline" size="sm" className="text-xs h-7">Contact</Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-4 text-xs">View all 89 →</Button>
                <Button variant="default" size="sm" className="mt-2 ml-2 text-xs">Send outreach to all</Button>
              </div>

              {/* Actions needed */}
              <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
                <h3 className="font-heading text-navy text-lg mb-4">Actions Needed Today</h3>
                <div className="space-y-3">
                  <ActionRow label="89 electrical checks overdue" action="Send outreach to all" variant="amber" />
                  <ActionRow label="342 patients inactive 18m+" action="Send outreach to all" variant="amber" />
                  <ActionRow label="12 water chambers due" action="View list" variant="outline" />
                </div>
              </div>

              {/* Support queue */}
              <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
                <h3 className="font-heading text-navy text-lg mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-deep-teal rounded-full" />
                  Support Queue
                </h3>
                <div className="space-y-3">
                  {supportQueue.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-2">
                      <div>
                        <p className="font-body text-foreground">{s.patient}</p>
                        <p className="font-body text-muted-foreground text-xs">{s.reason}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={s.priority} />
                        <Button variant="outline" size="sm" className="text-xs h-7">Mark Called</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top supplies */}
              <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
                <h3 className="font-heading text-navy text-lg mb-4">Top Supplies This Month</h3>
                <div className="space-y-2">
                  {topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1">
                      <span className="font-body text-foreground"><span className="font-mono text-deep-teal mr-2">{i + 1}.</span>{p.name}</span>
                      <span className="font-mono text-muted-foreground">{p.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance summary */}
              <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
                <h3 className="font-heading text-navy text-lg mb-4">Compliance Summary — April 2026</h3>
                <div className="space-y-2 text-sm">
                  <ComplianceRow icon="✓" label="Entitlement utilisation" value="74%" warn />
                  <ComplianceRow icon="⚠" label="Electrical checks overdue" value="89" error />
                  <ComplianceRow icon="✓" label="NHI reveals logged this month" value="12" />
                  <ComplianceRow icon="✓" label="Data exports logged" value="3" />
                  <ComplianceRow icon="✓" label="Inactive outreach sent" value="342" />
                </div>
                <Button className="mt-4" size="sm">Generate Monthly Report PDF →</Button>
              </div>

              {/* Stock indicators */}
              <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
                <h3 className="font-heading text-navy text-lg mb-4">Stock Indicators</h3>
                <div className="space-y-2">
                  {stockItems.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1">
                      <span className="font-body text-foreground">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">{s.units} units</span>
                        <span className={`w-2 h-2 rounded-full ${s.status === 'ok' ? 'bg-seafoam' : s.status === 'low' ? 'bg-amber' : 'bg-destructive'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patients tab */}
        {tab === 'patients' && !selectedPatient && (
          <div>
            <input type="text" placeholder="Search by name, Portal ID, or NHI..."
              className="w-full bg-card border border-sand rounded-xl px-4 py-3 font-body text-sm mb-4 focus:outline-none focus:border-deep-teal" />
            <div className="flex gap-2 mb-6 flex-wrap">
              {['All', 'Eligible', 'Not Eligible', 'Inactive 18m+', 'Electrical Check Due', 'Water Chamber Due'].map(f => (
                <button key={f} onClick={() => setPatientFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
                    patientFilter === f ? 'bg-deep-teal/10 text-deep-teal border border-deep-teal' : 'bg-muted text-muted-foreground border border-transparent'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="bg-card rounded-2xl border border-sand/50 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Name</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Portal ID</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40 hidden md:table-cell">NHI</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40 hidden lg:table-cell">Machine</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40 hidden md:table-cell">Entitlement</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id} className="border-t border-sand/30 hover:bg-muted/30">
                      <td className="p-3 font-body">{p.name}</td>
                      <td className="p-3 font-mono text-xs">{p.portalId}</td>
                      <td className="p-3 font-mono text-xs hidden md:table-cell">{maskNhi(p.nhi)}</td>
                      <td className="p-3 font-body text-xs hidden lg:table-cell">{p.equipment.machineName}</td>
                      <td className="p-3 hidden md:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                          p.entitlementStatus === 'eligible' ? 'bg-seafoam/15 text-seafoam-foreground' : 'bg-sand/30 text-foreground/50'
                        }`}>
                          {p.entitlementStatus === 'eligible' ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setSelectedPatient(p)}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Patient detail */}
        {tab === 'patients' && selectedPatient && (
          <div>
            <button onClick={() => setSelectedPatient(null)} className="font-body text-sm text-deep-teal mb-4 hover:underline">← Back to list</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient info */}
              <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
                <h2 className="font-heading text-navy text-2xl mb-4">{selectedPatient.name}</h2>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <Detail label="Portal ID" value={selectedPatient.portalId} mono />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 mb-1">NHI</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-foreground text-sm">
                        {nhiRevealed ? selectedPatient.nhi : maskNhi(selectedPatient.nhi)}
                      </span>
                      {nhiRevealed ? (
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-deep-teal" style={{ width: `${(nhiTimer / 30) * 100}%` }} />
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">{nhiTimer}s</span>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="text-[10px] h-6" onClick={() => { setNhiRevealed(true); setNhiTimer(30); }}>Reveal</Button>
                      )}
                    </div>
                  </div>
                  <Detail label="Email" value={selectedPatient.email} />
                  <Detail label="Phone" value={selectedPatient.phone} />
                  <Detail label="Address" value={`${selectedPatient.address}, ${selectedPatient.city} ${selectedPatient.postcode}`} />
                  <Detail label="GP" value={`${selectedPatient.gpName}`} />
                  <Detail label="Member Since" value={formatDate(selectedPatient.memberSince)} />
                  <Detail label="Eligible" value={selectedPatient.entitlementStatus === 'eligible' ? 'Yes' : 'No'} />
                </div>

                {/* Entitlement detail (admin only) */}
                <div className="mt-4 pt-4 border-t border-sand/30">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 mb-2">Entitlement Detail</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Detail label="Annual" value={`$${selectedPatient.entitlementTotal}`} />
                    <Detail label="Used" value={`$${selectedPatient.entitlementUsed}`} />
                    <Detail label="Remaining" value={`$${selectedPatient.entitlementTotal - selectedPatient.entitlementUsed}`} />
                    <Detail label="Last Order" value={formatDate(selectedPatient.lastOrderDate)} />
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button size="sm" className="text-xs">Edit Entitlement</Button>
                  <Button variant="outline" size="sm" className="text-xs">Add Order</Button>
                  <Button variant="outline" size="sm" className="text-xs">Mark Inactive</Button>
                  <Button variant="outline" size="sm" className="text-xs">Send Outreach</Button>
                </div>
              </div>

              {/* Equipment + orders */}
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
                  <h3 className="font-heading text-navy text-lg mb-3">Equipment</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Detail label="Machine" value={selectedPatient.equipment.machineName} />
                    <Detail label="Mask" value={`${selectedPatient.equipment.maskType} — ${selectedPatient.equipment.maskSize}`} />
                    <Detail label="Issued" value={formatDate(selectedPatient.equipment.machineIssued)} />
                    <Detail label="Warranty" value={formatDate(selectedPatient.equipment.warrantyExpiry)} />
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
                  <h3 className="font-heading text-navy text-lg mb-3">Orders ({selectedPatient.orders.length})</h3>
                  {selectedPatient.orders.map(o => (
                    <div key={o.id} className="flex items-center justify-between text-sm py-2 border-b border-sand/30 last:border-0">
                      <div>
                        <p className="font-body">{o.product}</p>
                        <p className="font-mono text-xs text-muted-foreground">{formatDate(o.date)}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                        o.status === 'Delivered' ? 'bg-seafoam/15 text-seafoam-foreground' : 'bg-amber/15 text-amber-foreground'
                      }`}>{o.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Staff notes */}
            <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6 mt-6">
              <h3 className="font-heading text-navy text-lg mb-3">Staff Notes</h3>
              <div className="text-sm space-y-2 mb-4">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="font-body text-foreground">Patient called 12 Apr — mask too tight. Try small cushion.</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">— admin@midlandsleep.co.nz · 12 Apr 2026</p>
                </div>
              </div>
              <textarea placeholder="Add a note..." className="w-full bg-muted/30 border-b-2 border-sand rounded-t-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-deep-teal resize-none h-20" />
              <Button size="sm" className="mt-2 text-xs">Save Note</Button>
            </div>

            {/* Access log */}
            <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6 mt-6">
              <button onClick={() => setAccessLogOpen(!accessLogOpen)} className="flex items-center gap-2 font-body text-sm text-deep-teal">
                {accessLogOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Show access history
              </button>
              {accessLogOpen && (
                <div className="mt-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left">
                        <th className="p-2 font-mono text-foreground/40 uppercase tracking-wider text-[10px]">Action</th>
                        <th className="p-2 font-mono text-foreground/40 uppercase tracking-wider text-[10px]">Staff</th>
                        <th className="p-2 font-mono text-foreground/40 uppercase tracking-wider text-[10px]">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.slice(0, 4).map((l, i) => (
                        <tr key={i} className="border-t border-sand/30">
                          <td className="p-2 font-body">{l.action}</td>
                          <td className="p-2 font-mono text-muted-foreground">{l.staff}</td>
                          <td className="p-2 font-mono text-muted-foreground">{l.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Button variant="outline" size="sm" className="mt-3 text-xs">
                    <Download size={12} /> Export this patient log
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            <div className="flex gap-2 mb-6 flex-wrap">
              {['All', 'Entitlement', 'Paid', 'Today', 'This week', 'This month'].map(f => (
                <button key={f} className="px-3 py-1.5 rounded-full text-xs font-body bg-muted text-muted-foreground border border-transparent hover:border-deep-teal/30">
                  {f}
                </button>
              ))}
            </div>
            <div className="bg-card rounded-2xl border border-sand/50 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Patient</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Products</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40 hidden md:table-cell">Type</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40 hidden md:table-cell">Date</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.flatMap(p => p.orders.map(o => ({ ...o, patientName: p.name, portalId: p.portalId }))).map((o, i) => (
                    <tr key={i} className="border-t border-sand/30 hover:bg-muted/30">
                      <td className="p-3 font-body">{o.patientName}</td>
                      <td className="p-3 font-body text-xs">{o.product}</td>
                      <td className="p-3 hidden md:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                          o.type === 'Entitlement' ? 'bg-seafoam/15 text-seafoam-foreground' : 'bg-deep-teal/15 text-deep-teal'
                        }`}>{o.type}</span>
                      </td>
                      <td className="p-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{formatDate(o.date)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                          o.status === 'Delivered' ? 'bg-seafoam/15 text-seafoam-foreground' : 'bg-amber/15 text-amber-foreground'
                        }`}>{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Credits tab */}
        {tab === 'credits' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard label="Total Entitlement Pool" value="$375,000" border="deep-teal" />
              <MetricCard label="Total Utilised" value="$278,000 (74%)" border="seafoam" />
              <MetricCard label="Total Remaining" value="$97,000" border="amber" />
              <MetricCard label="$0 Used Patients" value="312" border="sand" />
            </div>
            <div className="bg-card rounded-2xl border border-sand/50 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Patient</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Annual $</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Used $</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Remaining $</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40 hidden md:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id} className="border-t border-sand/30">
                      <td className="p-3 font-body">{p.name}</td>
                      <td className="p-3 font-mono">${p.entitlementTotal}</td>
                      <td className="p-3 font-mono">${p.entitlementUsed}</td>
                      <td className="p-3 font-mono">${p.entitlementTotal - p.entitlementUsed}</td>
                      <td className="p-3 hidden md:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                          p.entitlementStatus === 'eligible' ? 'bg-seafoam/15 text-seafoam-foreground' : 'bg-sand/30 text-foreground/50'
                        }`}>
                          {p.entitlementUsed === 0 ? 'Not started' : p.entitlementUsed >= p.entitlementTotal ? 'Fully used' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="outline" className="mt-4"><Download size={14} /> Export Credits Report CSV</Button>
          </div>
        )}

        {/* Analytics tab */}
        {tab === 'analytics' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {['7 days', '30 days', '90 days', '12 months'].map(r => (
                  <button key={r} onClick={() => setAnalyticsRange(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body ${
                      analyticsRange === r ? 'bg-deep-teal/10 text-deep-teal border border-deep-teal' : 'bg-muted text-muted-foreground'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
              <Button size="sm"><Download size={14} /> Export Report PDF</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Orders Per Month">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ordersPerMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 42% 78% / 0.5)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
                    <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#0B5C6C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Patient Login Activity">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={loginActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 42% 78% / 0.5)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
                    <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="logins" stroke="#74C0A2" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Support Contacts Over Time" subtitle="Declining contacts = portal working correctly">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={supportContacts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 42% 78% / 0.5)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
                    <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="contacts" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Top 5 Products Ordered">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 42% 78% / 0.5)" />
                    <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'DM Mono' }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontFamily: 'DM Sans' }} width={180} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0B5C6C" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        )}

        {/* Audit log tab */}
        {tab === 'audit' && (
          <div>
            <div className="flex justify-end mb-4">
              <Button size="sm"><Download size={14} /> Export full audit log CSV</Button>
            </div>
            <div className="bg-card rounded-2xl border border-sand/50 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Action</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Staff Member</th>
                    <th className="text-left p-3 font-mono text-[10px] uppercase tracking-wider text-foreground/40">Date + Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((l, i) => (
                    <tr key={i} className="border-t border-sand/30">
                      <td className="p-3 font-body">{l.action}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{l.staff}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{l.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, border }: { label: string; value: string; border: string }) {
  const borderColors: Record<string, string> = {
    'deep-teal': 'border-l-deep-teal',
    seafoam: 'border-l-seafoam',
    amber: 'border-l-amber',
    destructive: 'border-l-destructive',
    sand: 'border-l-sand',
  };
  return (
    <div className={`bg-card rounded-2xl border border-sand/50 shadow-sm p-5 border-l-4 ${borderColors[border] || ''}`}>
      <p className="font-body text-muted-foreground text-xs mb-1">{label}</p>
      <p className="font-heading text-navy text-2xl">{value}</p>
    </div>
  );
}

function ActionRow({ label, action, variant }: { label: string; action: string; variant: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-body text-foreground text-sm">{label}</span>
      <Button variant={variant === 'outline' ? 'outline' : 'default'} size="sm" className={`text-xs h-7 ${variant === 'amber' ? 'bg-amber text-amber-foreground hover:bg-amber/90' : ''}`}>
        {action}
      </Button>
    </div>
  );
}

function ComplianceRow({ icon, label, value, warn, error }: { icon: string; label: string; value: string; warn?: boolean; error?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="font-body text-foreground">
        <span className={error ? 'text-destructive' : warn ? 'text-amber' : 'text-seafoam'}>{icon}</span>{' '}
        {label}
      </span>
      <span className={`font-mono text-xs ${error ? 'text-destructive' : warn ? 'text-amber' : 'text-muted-foreground'}`}>{value}</span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: 'HIGH' | 'MEDIUM' | 'LOW' }) {
  const styles = {
    HIGH: 'bg-destructive/15 text-destructive',
    MEDIUM: 'bg-amber/15 text-amber-foreground',
    LOW: 'bg-seafoam/15 text-seafoam-foreground',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${styles[priority]}`}>{priority}</span>;
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6">
      <h3 className="font-heading text-navy text-lg mb-1">{title}</h3>
      {subtitle && <p className="font-body text-muted-foreground text-xs mb-4">{subtitle}</p>}
      <div className="mt-4">{children}</div>
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

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' });
}
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ClipboardList, Contact, HeartPulse, Home, Package, ShoppingBag, User, Wrench, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'Dashboard', path: '/portal/dashboard', icon: Home },
  { label: 'My Equipment', path: '/portal/equipment', icon: Package },
  { label: 'Request Supplies', path: '/portal/reorder', icon: ClipboardList },
  { label: 'Shop', path: '/portal/shop', icon: ShoppingBag },
  { label: 'Maintenance', path: '/portal/maintenance', icon: Wrench },
  { label: 'Contact', path: '/portal/contact', icon: Contact },
  { label: 'Profile', path: '/portal/profile', icon: User },
];

const mobileNav = nav.filter((item) => ['Dashboard', 'My Equipment', 'Request Supplies', 'Shop', 'Profile'].includes(item.label));

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 bg-navy text-navy-foreground md:flex md:flex-col">
        <div className="px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-navy font-heading text-2xl">M</div>
            <div>
              <p className="font-heading text-2xl leading-none">Midland Sleep</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-navy-foreground/55">Patient Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-r-2xl px-4 py-3 font-body text-sm transition-colors',
                isActive ? 'border-l-4 border-seafoam bg-deep-teal/45 text-navy-foreground' : 'border-l-4 border-transparent text-navy-foreground/72 hover:bg-navy-foreground/10'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-5">
          <p className="font-body text-sm">{user?.name}</p>
          <p className="font-mono text-xs text-navy-foreground/55">MPID {user?.portalId}</p>
          <button
            className="mt-4 flex items-center gap-2 font-body text-sm text-navy-foreground/70 hover:text-navy-foreground"
            onClick={() => { logout(); navigate('/'); }}
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 bg-navy px-4 py-3 text-navy-foreground md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-seafoam" />
            <span className="font-heading text-xl">Midland Sleep</span>
          </div>
          <span className="font-mono text-xs">{user?.portalId}</span>
        </div>
      </header>

      <main className="pb-24 md:ml-64 md:pb-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 bg-card shadow-[0_-8px_24px_hsl(var(--navy)/0.08)] md:hidden">
        {mobileNav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} className={cn('flex flex-col items-center gap-1 px-1 py-3 font-body text-[11px]', active ? 'text-seafoam-foreground' : 'text-muted-foreground')}>
              <item.icon className={cn('h-5 w-5', active && 'text-seafoam')} />
              <span className="truncate">{item.label.replace('My ', '').replace('Request ', '')}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

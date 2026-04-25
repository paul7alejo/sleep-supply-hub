import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="bg-navy px-4 py-3 text-navy-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-heading text-xl text-navy">M</span>
          <span className="font-heading text-2xl">Midland Sleep</span>
        </Link>
        {isAuthenticated && user ? (
          <Button variant="outline" size="sm" className="border-cream text-cream hover:bg-cream/10" onClick={() => { logout(); navigate('/'); }}>Log Out</Button>
        ) : null}
      </div>
    </nav>
  );
}

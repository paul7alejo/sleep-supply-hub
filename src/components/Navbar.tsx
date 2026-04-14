import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-navy text-navy-foreground text-center py-2 px-4 font-mono text-xs tracking-wide uppercase">
        Midland Sleep patient portal — Waikato DHB Sleep Service
      </div>

      {/* Main nav */}
      <nav className="bg-card border-b border-sand px-4 md:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-deep-teal flex items-center justify-center">
            <span className="text-deep-teal-foreground font-heading text-lg font-bold">M</span>
          </div>
          <span className="font-heading text-navy text-xl font-semibold hidden sm:inline">Midland Sleep</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {user.role === 'patient' && (
                <Link to="/cart" className="relative p-2 text-navy hover:text-deep-teal transition-colors">
                  <ShoppingBag size={22} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-deep-teal text-deep-teal-foreground text-xs rounded-full flex items-center justify-center font-mono">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}
              <span className="text-sm text-muted-foreground font-body">{user.firstName}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
                <LogOut size={16} />
                <span className="ml-1">Log Out</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/')} size="sm">Log In</Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-navy" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-sand px-4 py-4 flex flex-col gap-3">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              {user.role === 'patient' && (
                <Link to="/cart" className="flex items-center gap-2 text-navy" onClick={() => setMobileOpen(false)}>
                  <ShoppingBag size={18} />
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
              )}
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left text-muted-foreground text-sm">
                Log Out
              </button>
            </>
          ) : (
            <Button onClick={() => { navigate('/'); setMobileOpen(false); }} size="sm">Log In</Button>
          )}
        </div>
      )}
    </>
  );
}
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';

export default function OrderConfirmed() {
  const { user, isAuthenticated } = useAuth();
  const { items, totalPaid, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const hasPaidItems = items.some(i => !i.isEntitlement);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-card rounded-2xl shadow-sm p-8 max-w-[560px] w-full">
          <div className="flex justify-center mb-6">
            <div className="w-[72px] h-[72px] bg-seafoam/15 rounded-full flex items-center justify-center">
              <span className="text-seafoam text-3xl">✓</span>
            </div>
          </div>

          <h1 className="font-heading text-navy text-[28px] text-center mb-2">Order confirmed.</h1>
          <p className="font-body text-foreground/60 text-center mb-8">
            {hasPaidItems ? 'Payment received. Your supplies are on their way.' : 'Your supplies are on their way.'}
          </p>

          <div className="mb-6">
            <p className="font-mono text-foreground/40 text-[10px] uppercase tracking-wider mb-3">Order Details</p>

            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="font-body text-foreground">{item.name}</span>
                  {item.isEntitlement ? (
                    <span className="font-body text-seafoam">Covered</span>
                  ) : (
                    <span className="font-mono text-foreground">${item.price.toFixed(2)}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-body text-foreground/50">Delivering to:</span>
                <p className="font-body text-foreground">{user.address}, {user.city} {user.postcode}</p>
              </div>
              <div>
                <span className="font-body text-foreground/50">Estimated delivery:</span>
                <p className="font-body text-foreground">2–3 business days</p>
              </div>
              <div>
                <span className="font-body text-foreground/50">Tracking:</span>
                <p className="font-body text-foreground">We will send a tracking link to {user.email} when your order is dispatched.</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 h-px mb-6" />

          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => { clearCart(); navigate('/account'); }}>
              View My Orders →
            </Button>
            <Button variant="outline" className="w-full" size="lg" onClick={() => { clearCart(); navigate('/dashboard'); }}>
              Back to Dashboard
            </Button>
          </div>

          <p className="font-body text-foreground/40 text-xs text-center mt-6">
            Questions about your order? Use the help button on your dashboard or call 0800 XXX XXX.
          </p>
        </div>
      </div>
    </div>
  );
}
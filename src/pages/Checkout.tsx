import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { items, totalPaid } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const shipping = 8.95;
  const total = totalPaid + shipping;
  const entitlementItems = items.filter(i => i.isEntitlement);
  const paidItems = items.filter(i => !i.isEntitlement);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left */}
          <div className="lg:col-span-3">
            {entitlementItems.length > 0 && (
              <div className="bg-seafoam/10 border-l-4 border-seafoam rounded-r-xl p-4 mb-6">
                <p className="font-body text-seafoam-foreground text-sm">✓ Your entitlement covers {entitlementItems.map(i => i.name).join(', ')}.</p>
                <p className="font-body text-foreground/60 text-xs mt-1">Only the add-ons below require payment.</p>
              </div>
            )}

            {/* Express payment */}
            <div className="space-y-3 mb-8">
              <p className="font-body text-foreground/60 text-xs">Pay quickly with:</p>
              <Button variant="navy" className="w-full" size="lg" onClick={() => navigate('/order-confirmed')}>
                Pay via POLi Online Banking
              </Button>
              <Button className="w-full" size="lg" onClick={() => navigate('/order-confirmed')}>
                Pay by Card
              </Button>
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-sand flex-1" />
                <span className="text-foreground/30 text-xs font-body">OR</span>
                <div className="h-px bg-sand flex-1" />
              </div>
            </div>

            {/* Delivery form */}
            <h2 className="font-body text-navy text-base font-semibold mb-1">Delivery details</h2>
            <span className="font-mono text-seafoam text-[11px] uppercase tracking-wider">✓ Pre-filled from your account</span>

            <div className="bg-deep-teal-pale border border-deep-teal/20 rounded-xl p-3 mt-4 mb-6">
              <p className="font-body text-foreground text-[11px]">
                Midland Sleep collects this to process your order under the Health Information Privacy Code 2020. Privacy Policy →
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="First Name" defaultValue={user.firstName} />
              <FormField label="Last Name" defaultValue={user.name.split(' ').slice(1).join(' ')} />
              <FormField label="Email Address" defaultValue={user.email} className="sm:col-span-2" />
              <FormField label="Phone" defaultValue={user.phone} />
              <FormField label="Address" defaultValue={user.address} className="sm:col-span-2" />
              <FormField label="Suburb" defaultValue={user.suburb} />
              <FormField label="City" defaultValue={user.city} />
              <FormField label="Postcode" defaultValue={user.postcode} />
            </div>
            <p className="font-body text-foreground/40 text-[11px] mt-3">Delivery address is saved to your account for future orders.</p>
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="font-heading text-navy text-xl mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span className="font-body text-foreground">{item.name}</span>
                      <span className="font-mono text-foreground/50 text-xs ml-2">Qty: 1</span>
                    </div>
                    {item.isEntitlement ? (
                      <span className="font-mono text-seafoam text-xs bg-seafoam/10 px-2 py-0.5 rounded">Covered</span>
                    ) : (
                      <span className="font-mono text-foreground">${item.price.toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-muted/30 rounded-xl p-3 space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="font-body text-foreground/60">Subtotal</span>
                  <span className="font-mono">${totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-body text-foreground/60">Shipping</span>
                  <span className="font-mono">${shipping.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-body text-foreground/60">Total</span>
                <span className="font-heading text-navy text-[22px]">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={() => navigate('/order-confirmed')}>
                Confirm and Pay — ${total.toFixed(2)} →
              </Button>
              <p className="font-body text-foreground/40 text-[11px] text-center mt-3">🔒 Secured by POLi / Stripe. Your data is encrypted.</p>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="flex items-center justify-center gap-6 mt-12 py-6 border-t border-sand/50 text-foreground/40 text-xs font-body">
          <span>🔒 256-bit encryption</span>
          <span>NZ data storage</span>
          <span>HIPC 2020 compliant</span>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, defaultValue, className }: { label: string; defaultValue: string; className?: string }) {
  return (
    <div className={className}>
      <label className="font-mono uppercase text-[10px] text-foreground/50 tracking-wider mb-1 block">{label}</label>
      <input
        type="text" defaultValue={defaultValue}
        className="w-full bg-muted/30 border-b-2 border-sand px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-deep-teal transition-colors"
      />
    </div>
  );
}
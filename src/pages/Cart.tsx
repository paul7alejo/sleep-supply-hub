import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag } from 'lucide-react';

const addOns = [
  { id: 'addon-wipes', name: 'CPAP Cleaning Wipes × 10', price: 12 },
  { id: 'addon-case', name: 'Travel Carrying Case', price: 35 },
  { id: 'addon-filters', name: 'Replacement Filters (AirSense compatible)', price: 18 },
];

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const { items, removeItem, addItem, totalPaid, itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const isEligible = user.entitlementStatus === 'eligible';
  const entitlementItems = items.filter(i => i.isEntitlement);
  const paidItems = items.filter(i => !i.isEntitlement);
  const hasPaidItems = paidItems.length > 0;
  const shipping = hasPaidItems ? 8.95 : 0;
  const total = totalPaid + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 px-4">
          <div className="w-20 h-20 bg-deep-teal/10 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={36} className="text-deep-teal" />
          </div>
          <h2 className="font-heading text-navy text-2xl mb-2">Your order is empty</h2>
          <p className="font-body text-muted-foreground text-sm mb-6">Go back and add your approved supplies.</p>
          <Button variant="outline" onClick={() => navigate('/reorder')}>← Back to My Supplies</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Not eligible banner */}
      {!isEligible && (
        <div className="bg-amber/10 border-l-4 border-amber px-6 py-4">
          <p className="font-body text-amber-foreground text-sm font-medium">Your entitlement has been used for this period.</p>
          <p className="font-body text-foreground/60 text-xs mt-1">Resets in 4 months — October 2026. You can still order at full price below.</p>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left */}
          <div className="lg:col-span-3">
            <h1 className="font-heading text-navy text-[28px] mb-1">Your Order</h1>
            <p className="font-body text-foreground/60 text-sm mb-6">Review your items before confirming.</p>

            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item.id} className="bg-card rounded-2xl shadow-sm p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-deep-teal-pale rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={20} className="text-deep-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-navy font-medium text-[15px]">{item.name}</p>
                    <p className="font-body text-foreground/60 text-[13px]">{item.maskSeries}</p>
                    {item.isEntitlement ? (
                      <span className="inline-block mt-2 bg-seafoam/10 text-seafoam-foreground px-2.5 py-1 rounded text-[11px] font-mono uppercase">
                        Covered by your entitlement
                      </span>
                    ) : (
                      <p className="font-mono text-foreground text-sm mt-1">${item.price.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {item.isEntitlement ? (
                      <span className="font-mono text-seafoam text-sm">FREE</span>
                    ) : (
                      <span className="font-mono text-foreground text-sm">${item.price.toFixed(2)}</span>
                    )}
                    <button onClick={() => removeItem(item.id)} className="block text-foreground/40 text-xs mt-1 hover:text-destructive font-body">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add-ons */}
            {isEligible && (
              <div className="bg-muted/30 rounded-2xl border border-sand p-5">
                <h3 className="font-body text-navy text-sm font-semibold mb-1">Add-ons for your care</h3>
                <p className="font-body text-foreground/50 text-xs mb-4">Not covered by entitlement — you pay for these</p>
                {addOns.map(a => {
                  const inCart = items.some(i => i.id === a.id);
                  return (
                    <div key={a.id} className="flex items-center justify-between py-2">
                      <span className="font-body text-navy text-sm">{a.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-foreground text-sm">${a.price.toFixed(2)}</span>
                        {inCart ? (
                          <span className="text-xs text-muted-foreground font-mono">Added</span>
                        ) : (
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => addItem({ id: a.id, name: a.name, description: '', maskSeries: '', price: a.price, isEntitlement: false })}>
                            + Add
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="font-heading text-navy text-[22px] mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="font-body text-foreground truncate mr-2">{item.name}</span>
                    {item.isEntitlement ? (
                      <span className="font-body text-seafoam flex-shrink-0">Covered</span>
                    ) : (
                      <span className="font-mono text-foreground flex-shrink-0">${item.price.toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-muted/30 rounded-xl p-3 mb-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-body text-foreground/60">Entitlement items</span>
                  <span className="font-body text-seafoam">FREE</span>
                </div>
                {hasPaidItems && (
                  <div className="flex justify-between text-sm">
                    <span className="font-body text-foreground/60">Add-ons shipping</span>
                    <span className="font-mono text-foreground">${shipping.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline mb-6">
                <span className="font-body text-foreground/60 text-sm">Total</span>
                <span className="font-heading text-navy text-2xl">${total.toFixed(2)}</span>
              </div>

              <div className="bg-deep-teal-pale rounded-xl p-3 mb-4 text-sm">
                <p className="font-body text-foreground">📦 Delivering to: {user.address}, {user.city} {user.postcode}</p>
              </div>

              {hasPaidItems ? (
                <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                  Proceed to Payment →
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={() => navigate('/order-confirmed')}>
                  Confirm and Send Order →
                </Button>
              )}
              <p className="font-body text-foreground/50 text-xs text-center mt-3">
                {hasPaidItems ? 'Securely processed via POLi or card.' : 'No payment needed. Delivered in 2–3 business days.'}
              </p>
            </div>

            <p className="font-body text-foreground/40 text-[11px] mt-4 text-center leading-relaxed">
              Your order is processed under the Health Information Privacy Code 2020. Privacy Policy →
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
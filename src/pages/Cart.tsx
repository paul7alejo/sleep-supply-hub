import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortalLayout } from '@/components/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const { items, removeItem, updateQuantity, totalPaid } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <PortalLayout>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_360px]">
        <section>
          <h1 className="font-heading text-4xl text-navy md:text-5xl">Cart</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">Review your patient items before checkout.</p>

          {items.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-deep-teal-pale">
                <ShoppingBag className="h-7 w-7 text-deep-teal" />
              </div>
              <h2 className="mt-5 font-heading text-2xl text-navy">Your cart is empty</h2>
              <p className="mt-2 font-body text-sm text-muted-foreground">Add patient price items from the shop, or request funded supplies.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={() => navigate('/portal/shop')}>Shop Patient Items</Button>
                <Button variant="outline" onClick={() => navigate('/portal/reorder')}>Request Supplies</Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {items.map((item) => (
                <article key={item.id} className="rounded-2xl bg-card p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="rounded-full bg-seafoam/15 px-3 py-1 font-mono text-[11px] text-seafoam-foreground">
                        {item.isEntitlement ? 'Funded Supply' : 'Patient Price'}
                      </span>
                      <h2 className="mt-3 font-body text-lg font-medium text-foreground">{item.name}</h2>
                      {item.brand && <p className="font-body text-sm text-muted-foreground">{item.brand}</p>}
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center rounded-full bg-muted/50 px-2 py-1">
                        <button className="px-3 py-1 font-mono" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span className="min-w-6 text-center font-mono text-sm">{item.quantity}</span>
                        <button className="px-3 py-1 font-mono" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="rounded-full p-2 text-muted-foreground hover:bg-muted" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-heading text-2xl text-navy">Checkout</h2>
          <div className="mt-5 space-y-3 font-body text-sm">
            <div className="flex justify-between"><span>Items</span><span className="font-mono">{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
            <div className="flex justify-between text-base"><span>Patient items total</span><span className="font-mono text-navy">${totalPaid.toFixed(2)}</span></div>
          </div>
          <Button className="mt-6 w-full" size="lg" disabled={items.length === 0} onClick={() => navigate('/portal/checkout')}>
            Go to Checkout →
          </Button>
          <Button className="mt-3 w-full" variant="outline" onClick={() => navigate('/portal/shop')}>
            Continue Shopping
          </Button>
        </aside>
      </div>
    </PortalLayout>
  );
}
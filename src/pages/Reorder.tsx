import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  maskSeries: string;
  price: number;
}

const productsByMask: Record<string, Product[]> = {
  'ResMed AirFit F30i Full Face': [
    { id: 'f30i-cushion', name: 'AirFit F30i Full Face Cushion', description: 'Replacement cushion for your F30i mask', maskSeries: 'AirFit F30i', price: 45 },
    { id: 'f30i-headgear', name: 'AirFit F30i Headgear — Standard', description: 'Replacement headgear strap', maskSeries: 'AirFit F30i', price: 38 },
    { id: 'f30i-clip', name: 'AirFit F30i Cushion Clip', description: 'Cushion retaining clip', maskSeries: 'AirFit F30i', price: 15 },
  ],
  'ResMed AirFit P10 Nasal Pillow': [
    { id: 'p10-pillow', name: 'AirFit P10 Nasal Pillow', description: 'Replacement nasal pillow', maskSeries: 'AirFit P10', price: 32 },
    { id: 'p10-headgear', name: 'AirFit P10 Headgear', description: 'Replacement headgear', maskSeries: 'AirFit P10', price: 35 },
  ],
  'Philips DreamWear Full Face': [
    { id: 'dw-cushion', name: 'DreamWear Full Face Cushion', description: 'Replacement full face cushion', maskSeries: 'DreamWear', price: 48 },
    { id: 'dw-headgear', name: 'DreamWear Headgear — Standard', description: 'Replacement headgear', maskSeries: 'DreamWear', price: 36 },
  ],
};

export default function Reorder() {
  const { user, isAuthenticated } = useAuth();
  const { addItem, itemCount, items } = useCart();
  const navigate = useNavigate();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const products = productsByMask[user.equipment.maskName] || [];
  const isEligible = user.entitlementStatus === 'eligible';

  const handleAdd = (p: Product) => {
    addItem({
      id: p.id,
      name: `${p.name} — ${user.equipment.maskSize}`,
      description: p.description,
      maskSeries: p.maskSeries,
      price: p.price,
      isEntitlement: isEligible,
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
        <h1 className="font-heading text-navy text-3xl mb-2">Reorder Your Supplies</h1>
        <p className="font-body text-muted-foreground mb-8">
          Based on your current mask: {user.equipment.maskName} — {user.equipment.maskSize}
        </p>

        <div className="space-y-4">
          {products.map(p => {
            const inCart = items.some(i => i.id === p.id);
            return (
              <div key={p.id} className="bg-card rounded-2xl border border-sand/50 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-body text-foreground font-medium">{p.name} — {user.equipment.maskSize}</h3>
                  <p className="font-body text-muted-foreground text-sm mt-1">{p.description}</p>
                  <span className="inline-block mt-2 bg-deep-teal-pale text-deep-teal px-3 py-1 rounded-full text-xs font-mono">
                    For your {p.maskSeries}
                  </span>
                  {isEligible && (
                    <p className="text-seafoam text-xs font-body mt-2">Included in your entitlement</p>
                  )}
                  {!isEligible && (
                    <p className="text-foreground text-sm font-mono mt-2">${p.price.toFixed(2)}</p>
                  )}
                </div>
                <Button
                  variant={addedId === p.id ? 'seafoam' : inCart ? 'outline' : 'default'}
                  size="default"
                  onClick={() => handleAdd(p)}
                  disabled={inCart && addedId !== p.id}
                >
                  {addedId === p.id ? '✓ Added' : inCart ? 'In Cart' : 'Add to Order'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-navy text-navy-foreground py-4 px-6 flex items-center justify-between z-50">
          <div className="flex items-center gap-2 font-body text-sm">
            <ShoppingBag size={18} />
            {itemCount} item{itemCount > 1 ? 's' : ''} in your order
          </div>
          <Button variant="hero" size="default" onClick={() => navigate('/cart')}>
            View Order →
          </Button>
        </div>
      )}
    </div>
  );
}
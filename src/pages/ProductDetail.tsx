import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortalLayout } from '@/components/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getShopProduct } from '@/data/demoData';

export default function ProductDetail() {
  const { slug } = useParams(); const product = getShopProduct(slug); const { isAuthenticated } = useAuth(); const { addItem, items, updateQuantity, removeItem, totalPaid } = useCart(); const navigate = useNavigate(); const [open, setOpen] = useState(false);
  useEffect(() => { if (!isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  const add = () => { addItem({ id: product.slug, slug: product.slug, name: product.name, brand: product.brand, price: product.price, rrp: product.rrp, isEntitlement: false }); navigate('/portal/cart'); };
  return <PortalLayout><div className="grid gap-8 lg:grid-cols-2"><div className={`min-h-[360px] rounded-2xl ${product.imageTone}`} /><section><span className="rounded-full bg-seafoam/15 px-3 py-1 font-mono text-xs text-seafoam-foreground">Patient Price</span><h1 className="mt-4 font-heading text-5xl text-navy">{product.name}</h1><p className="mt-2 font-body text-muted-foreground">{product.brand}</p><p className="mt-5 font-mono text-2xl text-navy">${product.price.toLocaleString('en-NZ', { minimumFractionDigits: 2 })} <span className="text-base text-muted-foreground line-through">${product.rrp.toLocaleString('en-NZ', { minimumFractionDigits: 2 })}</span></p>{product.isMachine && <div className="mt-5 rounded-2xl bg-seafoam/15 p-4 font-body text-sm text-seafoam-foreground">Bundle option: machine + mask kit + 2 accessories = 15% off</div>}<ul className="mt-6 grid gap-3">{product.features.map((feature) => <li key={feature} className="flex items-center gap-3 font-body"><Check className="h-5 w-5 text-seafoam" />{feature}</li>)}</ul><Button className="mt-8" size="lg" onClick={add}>Add to Cart</Button></section></div></PortalLayout>;
}

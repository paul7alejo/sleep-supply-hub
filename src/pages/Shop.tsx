import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PortalLayout } from '@/components/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { shopProducts, type ProductCategory } from '@/data/demoData';

const tabs: ProductCategory[] = ['Supplies', 'Accessories', 'Machines'];
export default function Shop() {
  const { isAuthenticated } = useAuth(); const navigate = useNavigate(); const { addItem } = useCart(); const [tab, setTab] = useState<ProductCategory>('Supplies');
  useEffect(() => { if (!isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  const addToCart = (p: (typeof shopProducts)[number]) => { addItem({ id: p.slug, slug: p.slug, name: p.name, brand: p.brand, price: p.price, rrp: p.rrp, isEntitlement: false }); navigate('/portal/cart'); };
  return <PortalLayout><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><h1 className="font-heading text-4xl text-navy md:text-5xl">Shop</h1><Button variant="outline" onClick={() => navigate('/portal/cart')}>View Cart →</Button></div><div className="mt-6 flex gap-2">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 font-body text-sm ${tab === t ? 'bg-navy text-navy-foreground' : 'bg-card text-navy shadow-sm'}`}>{t}</button>)}</div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shopProducts.filter((p) => p.category === tab).map((p) => <article key={p.slug} className="rounded-2xl bg-card p-5 shadow-sm"><button onClick={() => navigate(`/portal/shop/${p.slug}`)} className={`h-36 w-full rounded-2xl ${p.imageTone}`} aria-label={p.name} /><div className="mt-4 flex items-start justify-between gap-3"><div><h2 className="font-body font-medium text-foreground">{p.name}</h2><p className="font-body text-sm text-muted-foreground">{p.brand}</p></div><span className="rounded-full bg-seafoam/15 px-3 py-1 font-mono text-[11px] text-seafoam-foreground">Patient Price</span></div><p className="mt-4 font-mono text-lg text-navy">${p.price.toLocaleString('en-NZ', { minimumFractionDigits: 2 })} <span className="text-sm text-muted-foreground line-through">${p.rrp.toLocaleString('en-NZ', { minimumFractionDigits: 2 })}</span></p><Button className="mt-4 w-full" onClick={() => addToCart(p)}>Add to Cart →</Button></article>)}</div></PortalLayout>;
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PortalLayout } from '@/components/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function OrderConfirmed() {
  const { isAuthenticated } = useAuth(); const { clearCart } = useCart(); const navigate = useNavigate();
  useEffect(() => { if (!isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  return <PortalLayout><section className="mx-auto max-w-xl rounded-2xl bg-card p-8 text-center shadow-sm"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-seafoam/15"><svg viewBox="0 0 52 52" className="h-12 w-12"><path d="M14 27l8 8 17-18" fill="none" stroke="hsl(var(--seafoam))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_700ms_ease-out_forwards]" /></svg></div><h1 className="mt-6 font-heading text-4xl text-navy">Your request has been received.</h1><p className="mt-2 font-body text-muted-foreground">Confirmation MS-{Math.floor(10000 + Math.random() * 89999)}</p><Button className="mt-8" onClick={() => { clearCart(); navigate('/portal/dashboard'); }}>Back to Dashboard →</Button></section></PortalLayout>;
}

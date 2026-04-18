import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import BaseCard from '@/components/ui/BaseCard.jsx';
import { useCheckout } from '@/hooks/useCheckout';

const CheckoutSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { confirmStripeReturn, loading, error } = useCheckout();
    const [confirmed, setConfirmed] = useState(false);
    const confirmedOrderRef = useRef(null);
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        if (!orderId) {
            return;
        }

        if (confirmedOrderRef.current === orderId) {
            return;
        }

        confirmedOrderRef.current = orderId;

        const confirmReturn = async () => {
            try {
                await confirmStripeReturn(orderId);
                sessionStorage.removeItem('checkoutDraft');
                setConfirmed(true);
            } catch {
                setConfirmed(false);
            }
        };

        confirmReturn();
    }, [orderId]);

    return (
        <div className="max-w-3xl mx-auto">
            <BaseCard className="bg-subsonic-navfooter/70 p-8 gap-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-subsonic-muted">
                    Retorno desde Stripe
                </p>

                <h1 className="text-4xl font-black text-subsonic-accent uppercase tracking-tight">
                    {loading ? 'Confirmando pedido' : 'Pago completado'}
                </h1>

                <p className="text-subsonic-text/80 text-sm leading-6">
                    {loading
                        ? 'Estamos confirmando tu pedido.'
                        : confirmed
                            ? 'Tu compra ha sido registrada correctamente.'
                            : error || 'No se pudo confirmar el pedido.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                    <Button variant="outline" onClick={() => navigate('/history')}>
                        Ver historial
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/tienda')}>
                        Volver a la tienda
                    </Button>
                </div>
            </BaseCard>
        </div>
    );
};

export default CheckoutSuccess;
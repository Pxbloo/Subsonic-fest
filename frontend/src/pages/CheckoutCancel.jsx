import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import BaseCard from '@/components/ui/BaseCard.jsx';

const CheckoutCancel = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');

    return (
        <div className="max-w-3xl mx-auto">
            <BaseCard className="bg-subsonic-navfooter/70 p-8 gap-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-subsonic-muted">
                    Pago cancelado
                </p>

                <h1 className="text-4xl font-black text-subsonic-accent uppercase tracking-tight">
                    No se completó el pago
                </h1>

                <p className="text-subsonic-text/80 text-sm leading-6">
                    {orderId
                        ? 'Puedes volver a tu carrito con el mismo pedido pendiente o iniciar un nuevo checkout.'
                        : 'Puedes volver a tu carrito o iniciar un nuevo checkout.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                    <Button variant="outline" onClick={() => navigate('/checkout')}>
                        Reintentar
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/tienda')}>
                        Volver a la tienda
                    </Button>
                </div>
            </BaseCard>
        </div>
    );
};

export default CheckoutCancel;
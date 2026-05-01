import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '@/components/ui/PaymentForm';
import { useCheckout } from '@/hooks/useCheckout';
import Button from '@/components/ui/Button';
import BaseCard from '@/components/ui/BaseCard.jsx';
import { getCurrentUserId } from '@/utils/currentUser';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { startStripeCheckout, loading, error } = useCheckout();
    const [checkoutDraft, setCheckoutDraft] = useState(null);
    const [canSubmit, setCanSubmit] = useState(true);

    useEffect(() => {
        const nextDraft = location.state?.checkoutDraft;

        if (nextDraft) {
            setCheckoutDraft(nextDraft);
            sessionStorage.setItem('checkoutDraft', JSON.stringify(nextDraft));
            return;
        }

        try {
            const savedDraft = sessionStorage.getItem('checkoutDraft');
            if (savedDraft) {
                setCheckoutDraft(JSON.parse(savedDraft));
            }
        } catch (draftError) {
            console.error('Error restoring checkout draft:', draftError);
            setCheckoutDraft(null);
        }
    }, [location.state]);

    const totalAmountNumber = useMemo(() => {
        const rawAmount = checkoutDraft?.totalAmount ?? 0;
        const parsedAmount = typeof rawAmount === 'number' ? rawAmount : Number(rawAmount);
        return Number.isFinite(parsedAmount) ? parsedAmount : 0;
    }, [checkoutDraft]);

    const totalAmount = useMemo(() => {
        return totalAmountNumber.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
        });
    }, [totalAmountNumber]);

    const sourceLabel = useMemo(() => {
        if (checkoutDraft?.source === 'tickets') {
            return 'Compra de entradas';
        }

        if (checkoutDraft?.source === 'merchandising') {
            return 'Pedido de merchandising';
        }

        return 'Pedido en Subsonic Festival';
    }, [checkoutDraft]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!canSubmit) {
            alert('Por favor, espera antes de hacer más peticiones.');
            return;
        }
        setCanSubmit(false);

        if (!checkoutDraft) {
            setCanSubmit(true);
            return;
        }

        const orderId = checkoutDraft.orderId || (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2,9)}`);

        try {
            await startStripeCheckout({
                orderId,
                totalAmount: totalAmountNumber,
                userId: checkoutDraft.userId || getCurrentUserId(),
                source: checkoutDraft.source || 'checkout',
            });
        } catch (err) {
            console.error('Checkout error:', err);
        } finally {
            setCanSubmit(true);
        }
    };

    if (!checkoutDraft) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <h2 className="text-3xl font-montserrat font-black mb-4">No hay un pedido pendiente</h2>
                <p className="text-subsonic-muted text-sm">
                    Vuelve a la tienda o al festival para iniciar un checkout con Stripe.
                </p>

                <Button
                    variant="primarySmall"
                    className="mt-6"
                    onClick={() => navigate('/tienda')}
                >
                    Volver a la tienda
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col gap-8 md:flex-row">
            {/* Columna izquierda: resumen del pedido */}
            <section className="md:w-2/5">
                <BaseCard className="bg-subsonic-navfooter/60 rounded-xl gap-6">
                <header>
                    <h1 className="text-3xl md:text-4xl font-montserrat font-black mb-2 text-subsonic-accent">Pago</h1>
                    <p className="text-2xl font-montserrat font-bold text-subsonic-text">{totalAmount}</p>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-subsonic-muted mt-1">
                        Pasarela de pago segura
                    </p>
                </header>

                <div className="space-y-3 rounded-xl border border-subsonic-border bg-subsonic-bg/60 px-4 py-4">
                    <p className="text-sm text-subsonic-muted">{sourceLabel}</p>
                    <p className="text-base text-subsonic-text">
                        Finaliza tu compra de forma rápida y segura.
                    </p>
                </div>
                </BaseCard>
            </section>

            {/* Columna derecha: formulario de pago */}
            <section className="md:w-3/5">
                <BaseCard className="bg-subsonic-surface rounded-xl p-6 md:p-8 gap-6">
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <PaymentForm
                        onSubmit={handleSubmit}
                        isLoading={loading}
                        totalAmount={totalAmount}
                        sourceLabel={sourceLabel}
                    />
                </BaseCard>
            </section>
        </div>
    );
};

export default CheckoutPage;

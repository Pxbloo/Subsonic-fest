import React from 'react';
import Button from './Button';

const PaymentForm = ({ onSubmit, isLoading, totalAmount, sourceLabel = 'Tu pedido' }) => {
    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <div className="rounded-2xl border border-subsonic-border bg-subsonic-bg/50 p-5">
                <p className="text-[10px] font-montserrat uppercase tracking-[0.3em] text-subsonic-muted">
                    Pago alojado por Stripe
                </p>
                <h2 className="mt-2 text-2xl font-black text-subsonic-text uppercase tracking-tight">
                    {sourceLabel}
                </h2>
                <p className="mt-3 text-sm text-subsonic-muted">
                    Serás redirigido a la pasarela oficial de Stripe para completar tu pago.
                </p>
            </div>

            <div className="rounded-2xl border border-subsonic-border bg-subsonic-navfooter/60 p-5 flex items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] font-montserrat uppercase tracking-[0.3em] text-subsonic-muted">
                        Total a pagar
                    </p>
                    <p className="mt-2 text-3xl font-black text-subsonic-accent">
                        {totalAmount}
                    </p>
                </div>

                <div className="max-w-45 text-right text-xs text-subsonic-muted leading-5">
                    Tu pago se procesa de forma segura en Stripe.
                </div>
            </div>

            <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full mt-4 disabled:opacity-60 tracking-widest text-xs"
            >
                {isLoading ? 'Redirigiendo...' : 'Pagar con Stripe'}
            </Button>
        </form>
    );
};

export default PaymentForm;
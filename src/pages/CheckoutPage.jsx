import React from 'react';
import PaymentForm from '@/components/ui/PaymentForm';
import { useCheckout } from '@/hooks/useCheckout';

const CheckoutPage = () => {
    const { handlePayment, loading, error, completed } = useCheckout();
    const totalAmount = '49,99 €';

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const paymentData = Object.fromEntries(data.entries());
        handlePayment(paymentData);
    };

    if (completed) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <h2 className="text-3xl font-montserrat font-black mb-4">Pago completado</h2>
                <p className="text-subsonic-muted text-sm">¡Gracias por tu compra! Hemos registrado tu pedido.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col gap-8 md:flex-row">
            {/* Columna izquierda: resumen del pedido */}
            <section className="md:w-2/5 bg-subsonic-navfooter/60 border border-subsonic-border rounded-xl p-6 flex flex-col gap-6">
                <header>
                    <h1 className="text-3xl md:text-4xl font-montserrat font-black mb-2 text-subsonic-accent">Pago</h1>
                    <p className="text-2xl font-montserrat font-bold text-subsonic-text">{totalAmount}</p>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-subsonic-muted mt-1">X artículos · Detalle de tu pedido</p>
                </header>

                <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="flex items-center justify-between bg-subsonic-bg/60 border border-subsonic-border rounded-lg px-4 py-3"
                        >
                            <div>
                                <p className="text-xs font-semibold text-subsonic-text">Nombre producto</p>
                                <p className="text-[10px] text-subsonic-muted">Tipo / categoría</p>
                            </div>
                            <span className="text-xs font-montserrat text-subsonic-accent">Precio</span>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="mt-auto text-[11px] uppercase tracking-[0.25em] text-subsonic-accent hover:text-subsonic-text transition-colors text-left"
                >
                    Más recomendaciones
                </button>
            </section>

            {/* Columna derecha: formulario de pago */}
            <section className="md:w-3/5 bg-subsonic-surface border border-subsonic-border rounded-xl p-6 md:p-8 flex flex-col gap-6">
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <PaymentForm onSubmit={handleSubmit} isLoading={loading} totalAmount={totalAmount} />
            </section>
        </div>
    );
};

export default CheckoutPage;
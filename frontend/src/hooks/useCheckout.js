import { useState } from 'react';
import API_BASE_URL from '@/config/api';

export const useCheckout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startStripeCheckout = async ({ orderId, totalAmount, userId = null, source = 'checkout' }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/checkout-stripe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create',
                    order_id: orderId,
                    total_amount: totalAmount,
                    user_id: userId,
                    source,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'No se pudo iniciar el pago con Stripe.');
            }

            if (!data.checkoutUrl) {
                throw new Error('Stripe no devolvió una URL de pago.');
            }

            window.location.assign(data.checkoutUrl);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al procesar el pago. Inténtalo de nuevo.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const confirmStripeReturn = async (orderId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/checkout-stripe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'confirm',
                    order_id: orderId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'No se pudo confirmar el pedido.');
            }

            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo confirmar el pedido.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, startStripeCheckout, confirmStripeReturn };
};
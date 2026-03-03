import { useState } from 'react';

export const useCheckout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [completed, setCompleted] = useState(false);

    const handlePayment = async (paymentData) => {
        setLoading(true);
        setError(null);

        try {
            // romper Stripe en el backend, de momento esta simulado
            await new Promise((resolve) => setTimeout(resolve, 2000)); 

            setCompleted(true);
        } catch (err) {
            setError('Error al procesar el pago. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }

    };
    
    return { loading, error, completed, handlePayment };
};
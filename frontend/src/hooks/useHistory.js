import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import API_BASE_URL from '@/config/api';

export const useHistory = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const storedUser = (() => {
                    try {
                        return JSON.parse(localStorage.getItem('user') || 'null');
                    } catch {
                        return null;
                    }
                })();

                const orderQuery = storedUser?.id ? `?user_id=${encodeURIComponent(storedUser.id)}` : '';

                let historyHeaders = undefined;
                const auth = getAuth();
                if (auth.currentUser) {
                    const token = await auth.currentUser.getIdToken();
                    historyHeaders = {
                        Authorization: `Bearer ${token}`,
                    };
                }

                const [historyRes, ordersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/history`, {
                        headers: historyHeaders,
                    }),
                    fetch(`${API_BASE_URL}/orderItems${orderQuery}`),
                ]);

                const history = historyRes.ok ? await historyRes.json() : [];
                const orders = ordersRes.ok ? await ordersRes.json() : [];

                const merchandising = (orders || []).map((order) => {
                    const amount = Number(order.amount ?? 0);

                    return {
                        id: order.id,
                        title: order.title || 'Pedido en Subsonic Festival',
                        date: order.created_at ? order.created_at.slice(0, 10) : '',
                        amount,
                        status: order.status === 'paid_test' ? 'Completado' : 'Pendiente',
                    };
                });

                setData({ pastFestivals: history || [], merchandising: merchandising || [] });
            } catch (error) {
                console.error('Error fetching history data:', error);
                setData({ pastFestivals: [], merchandising: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return { data, loading };
};
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import API_BASE_URL from '@/config/api';
import { getCurrentUserId } from '@/utils/currentUser';

const getTime = (value) => {
    const time = Date.parse(value || '');
    return Number.isNaN(time) ? 0 : time;
};

export const useHistory = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const currentUserId = getCurrentUserId();
                const orderQuery = currentUserId ? `?user_id=${encodeURIComponent(currentUserId)}` : '';

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

                const sortedHistory = [...(history || [])].sort((a, b) =>
                    getTime(b.date || b.created_at) - getTime(a.date || a.created_at)
                );

                const merchandising = (orders || [])
                    .map((order) => {
                        const amount = Number(order.amount ?? 0);

                        return {
                            id: order.id,
                            title: order.title || 'Pedido en Subsonic Festival',
                            date: order.created_at ? order.created_at.slice(0, 10) : '',
                            created_at: order.created_at,
                            amount,
                            status: order.status === 'paid_test' ? 'Completado' : 'Pendiente',
                        };
                    })
                    .sort((a, b) => getTime(b.created_at || b.date) - getTime(a.created_at || a.date));

                setData({ pastFestivals: sortedHistory, merchandising: merchandising || [] });
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

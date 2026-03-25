import { useState, useEffect } from "react";
import API_BASE_URL from '@/config/api';

export const useHistory = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [historyRes, merchRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/history`),
                    fetch(`${API_BASE_URL}/merchandising`),
                ]);

                const history = historyRes.ok ? await historyRes.json() : [];
                const merchandising = merchRes.ok ? await merchRes.json() : [];

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
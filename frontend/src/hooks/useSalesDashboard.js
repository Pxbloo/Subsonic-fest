import { useCallback, useEffect, useMemo, useState } from "react";
import API_BASE_URL from '@/config/api';

const useSalesDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [festivals, setFestivals] = useState([]);
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [festivalsRes, groundsRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/festivals`),
          fetch(`${API_BASE_URL}/grounds`),
        ]);

        if (festivalsRes.status === 'fulfilled' && festivalsRes.value.ok) {
          const data = await festivalsRes.value.json();
          setFestivals(data || []);
        }

        if (groundsRes.status === 'fulfilled' && groundsRes.value.ok) {
          const data = await groundsRes.value.json();
          setGrounds(data || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setFestivals([]);
        setGrounds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFestivals = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return festivals;
    return festivals.filter((festival) =>
      [festival.id, festival.title, festival.date, festival.startDate, festival.location]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [searchTerm, festivals]);

  const filteredGrounds = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return grounds;
    return grounds.filter((ground) =>
      [ground.id, ground.name, ground.area, ground.status, ground.capacity]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [searchTerm, grounds]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    loading,
    searchTerm,
    festivals,
    grounds,
    filteredFestivals,
    filteredGrounds,
    handleSearchChange,
    clearSearch,
  };
};

export default useSalesDashboard;

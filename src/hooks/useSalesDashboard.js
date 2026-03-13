import { useCallback, useMemo, useState } from "react";
import festivals from "@/data/festivals.json";
import grounds from "@/data/grounds.json";

const useSalesDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFestivals = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return festivals;
    return festivals.filter((festival) =>
      festival.title.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredGrounds = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return grounds;
    return grounds.filter((ground) =>
      ground.name.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    filteredFestivals,
    filteredGrounds,
    handleSearchChange,
    clearSearch,
  };
};

export default useSalesDashboard;

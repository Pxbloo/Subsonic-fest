import { useState, useEffect } from "react";
import historyData from "@/data/history.json";

export const useHistory = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setData(historyData);
            setLoading(false);
        }, 500); // simula el fetch de datos con un retraso de 500ms

        return () => clearTimeout(timer); 
    }, []);

    return { data, loading };
};
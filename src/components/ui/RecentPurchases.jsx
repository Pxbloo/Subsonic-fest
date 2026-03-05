// src/components/profile/RecentPurchases.jsx
import React from "react";

const RecentPurchases = ({ purchases = [] }) => {
    return (
        <div>
            <h3 className="text-lg font-black text-subsonic-text uppercase mb-4">
                Compras recientes
            </h3>

            {purchases.length === 0 ? (
                <p className="text-sm text-subsonic-text/70">Aún no tienes compras.</p>
            ) : (
                <ul className="space-y-3">
                    {purchases.map((p) => (
                        <li
                            key={p.id}
                            className="border border-subsonic-border rounded-xl p-4 bg-subsonic-bg/40"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-subsonic-text truncate">
                                        {p.title}
                                    </p>
                                    <p className="text-xs text-subsonic-text/70 mt-1">
                                        {p.date} · {p.status}
                                    </p>
                                </div>

                                <div className="text-sm font-black text-subsonic-text whitespace-nowrap">
                                    €{Number(p.amount).toFixed(2)}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecentPurchases;
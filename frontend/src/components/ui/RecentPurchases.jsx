// src/components/profile/RecentPurchases.jsx
import React from "react";
import { Link } from "react-router-dom";

const RecentPurchases = ({ purchases = [] }) => {
    const recentPurchases = purchases.slice(0, 3);

    return (
        <div>
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-subsonic-text uppercase">
                    Compras recientes
                </h3>

                <Link
                    to="/history"
                    className="shrink-0 rounded-full border border-subsonic-accent px-3 py-1 text-[10px] font-black uppercase tracking-wide text-subsonic-accent transition hover:bg-subsonic-accent hover:text-subsonic-bg"
                >
                    Ver todo
                </Link>
            </div>

            {recentPurchases.length === 0 ? (
                <p className="text-sm text-subsonic-text/70">Aún no tienes compras.</p>
            ) : (
                <ul className="space-y-3">
                    {recentPurchases.map((p) => (
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

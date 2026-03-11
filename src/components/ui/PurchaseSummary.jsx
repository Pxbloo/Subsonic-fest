import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

const formatCurrency = (value) =>
    value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
    });

const formatOptionLabel = (optionName) => {
    const labels = {
        extent: "Tamaño",
        size: "Talla",
        color: "Color",
        format: "Formato",
        finish: "Acabado",
    };

    return labels[optionName] ?? optionName;
};

function PurchaseSummary({
    open,
    items = [],
    onClose,
    onIncreaseItem,
    onDecreaseItem,
}) {
    const navigate = useNavigate();

    // ESC + bloqueo de scroll
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };

        document.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    const totalAmount = useMemo(
        () => items.reduce((sum, item) => sum + item.totalPrice, 0),
        [items]
    );

    const totalUnits = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const handleGoToPayment = () => {
        navigate("/checkout", {
            state: {
                orderItems: items.map((item, index) => ({
                    id: `${item.key}-${index}`,
                    name: item.productName,
                    category:
                        Object.entries(item.selectedOptions ?? {})
                            .map(([key, value]) => `${formatOptionLabel(key)}: ${value}`)
                            .join(" · ") || item.productCategory,
                    quantity: item.quantity,
                    price: item.totalPrice,
                    unitPrice: item.unitPrice,
                })),
                totalAmount,
            },
        });
        navigate("/checkout");

        onClose?.();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Resumen de compra"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-label="Cerrar resumen de compra"
            />

            <div className="relative z-10 w-[min(94vw,760px)] rounded-2xl border border-subsonic-border bg-subsonic-navfooter text-subsonic-text shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-subsonic-border p-5">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">
                            Resumen de compra
                        </h2>
                        <p className="mt-1 text-sm text-subsonic-muted">
                            {totalUnits} {totalUnits === 1 ? "unidad" : "unidades"} en el carrito
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 text-sm font-black hover:bg-white/10 transition"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-5">
                    {items.length === 0 ? (
                        <div className="rounded-xl border border-subsonic-border bg-subsonic-bg/40 px-4 py-6 text-center text-subsonic-muted">
                            No hay productos añadidos todavía.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.key}
                                    className="rounded-xl border border-subsonic-border bg-subsonic-bg/40 px-4 py-4"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-sm font-black uppercase">
                                                {item.productName}
                                            </p>

                                            <div className="mt-2 space-y-1">
                                                {Object.entries(item.selectedOptions ?? {}).map(
                                                    ([key, value]) => (
                                                        <p
                                                            key={key}
                                                            className="text-xs text-subsonic-muted"
                                                        >
                                                            {formatOptionLabel(key)}: {value}
                                                        </p>
                                                    )
                                                )}
                                            </div>

                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onDecreaseItem?.(item.key)}
                                                    className="h-9 w-9 rounded-full border border-subsonic-border bg-subsonic-bg/40 font-black hover:bg-white/10 transition"
                                                    aria-label={`Quitar una unidad de ${item.productName}`}
                                                >
                                                    −
                                                </button>

                                                <div className="min-w-10 text-center text-sm font-black">
                                                    {item.quantity}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => onIncreaseItem?.(item.key)}
                                                    className="h-9 w-9 rounded-full border border-subsonic-border bg-subsonic-bg/40 font-black hover:bg-white/10 transition"
                                                    aria-label={`Añadir una unidad de ${item.productName}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-left sm:text-right">
                                            <p className="text-xs text-subsonic-muted">
                                                {formatCurrency(item.unitPrice)} / unidad
                                            </p>
                                            <p className="text-base font-black text-subsonic-accent">
                                                {formatCurrency(item.totalPrice)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-subsonic-border p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-bold uppercase text-subsonic-muted">
                            Total compra
                        </span>
                        <span className="text-2xl font-black text-subsonic-accent">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            className="sm:flex-1"
                            onClick={onClose}
                        >
                            Seguir comprando
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            className="sm:flex-1 disabled:opacity-40 disabled:hover:bg-subsonic-accent"
                            onClick={handleGoToPayment}
                            disabled={items.length === 0}
                        >
                            Ir a pago
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PurchaseSummary;
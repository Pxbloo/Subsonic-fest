import React, { useEffect, useMemo, useState } from "react";

function ProductModal({ open, product, onClose, onAddToCart }) {
    const [qty, setQty] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});

    const title = useMemo(() => product?.name ?? "Producto", [product]);
    const purchaseOptions = useMemo(() => product?.purchaseOptions ?? [], [product]);
    const stock = Number(product?.stock ?? 0);
    const outOfStock = stock <= 0;

    // Reset state cada vez que se abre (así, si se cierra sin añadir, no se guarda nada)
    useEffect(() => {
        if (!open) return;
        // eslint-disable-next-line
        setQty(0);
        setSelectedOptions({});
    }, [open]);

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

    if (!open || !product) return null;

    const canDecrement = qty > 0;
    const canIncrement = qty < 20;
    const allOptionsSelected = purchaseOptions.every(
        (option) => Boolean(selectedOptions[option.name])
    );
    const canAdd = qty > 0 && allOptionsSelected && !outOfStock;

    const handleOptionChange = (optionName, value) => {
        setSelectedOptions((current) => ({
            ...current,
            [optionName]: value,
        }));
    };

    const handleAdd = () => {
        if (!canAdd) return;

        onAddToCart?.({
            product,
            quantity: qty,
            selectedOptions,
        });

        onClose?.();
    };

    const stopModalPropagation = (event) => {
        event.stopPropagation();
    };

    const handleClose = (event) => {
        event.stopPropagation();
        onClose?.();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={stopModalPropagation}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* Fondo difuminado */}
            <button
                type="button"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
                aria-label="Cerrar"
            />

            {/* Panel */}
            <div className="relative z-10 w-[min(94vw,860px)] overflow-hidden rounded-2xl border border-subsonic-border bg-subsonic-navfooter text-subsonic-text shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-subsonic-border p-5">
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-black uppercase tracking-tight">
                            {product.name}
                        </h2>
                        <p className="mt-1 text-sm font-bold text-subsonic-muted">
                            {product.category}
                        </p>
                    </div>

                    {/* Cerrar modal */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full px-3 py-1 text-sm font-black hover:bg-white/10 transition"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid gap-6 p-5 md:grid-cols-2">
                    {/* Imagen */}
                    <div className="w-full">
                        <div className="aspect-video w-full overflow-hidden rounded-xl border border-subsonic-border bg-subsonic-bg/40">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-subsonic-muted font-bold">
                                    Imagen Producto
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-subsonic-accent text-2xl font-black">
                                {product.price}€
                            </span>

                            {/* Seleccionar cantidad (mínimo 0 y máximo 20) */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="h-10 w-10 rounded-full border border-subsonic-border bg-subsonic-bg/40 font-black hover:bg-white/10 transition disabled:opacity-40"
                                    onClick={() => setQty((q) => Math.max(0, q - 1))}
                                    disabled={!canDecrement || outOfStock}
                                    aria-label="Quitar uno"
                                >
                                    −
                                </button>

                                <div className="min-w-12 rounded-xl border border-subsonic-border bg-subsonic-bg/40 px-4 py-2 text-center font-black">
                                    {qty}
                                </div>

                                <button
                                    type="button"
                                    className="h-10 w-10 rounded-full border border-subsonic-border bg-subsonic-bg/40 font-black hover:bg-white/10 transition disabled:opacity-40"
                                    onClick={() => setQty((q) => Math.min(20, q + 1))}
                                    disabled={!canIncrement || outOfStock}
                                    aria-label="Añadir uno"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info del producto */}
                    <div className="flex flex-col">
                        <p className="text-sm leading-relaxed opacity-85">
                            {product.description}
                        </p>

                        {outOfStock && (
                            <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
                                No hay existencias disponibles.
                            </div>
                        )}

                        {purchaseOptions.length > 0 && (
                            <div className="mt-5 grid gap-4">
                                {purchaseOptions.map((option) => (
                                    <div key={option.name}>
                                        <label className="mb-1 block text-sm font-black">
                                            {option.label}
                                        </label>
                                        <select
                                            value={selectedOptions[option.name] ?? ""}
                                            onChange={(e) =>
                                                handleOptionChange(option.name, e.target.value)
                                            }
                                            className="w-full bg-subsonic-bg/40 border border-subsonic-border px-4 py-2 outline-none focus:ring-2 focus:ring-subsonic-accent"
                                        >
                                            <option value="" disabled>
                                                Selecciona {option.label.toLowerCase()}
                                            </option>

                                            {option.values.map((value) => (
                                                <option key={value} value={value}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 rounded-full border border-subsonic-border bg-subsonic-bg/40 px-6 py-3 text-sm font-black uppercase hover:bg-white/10 transition"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleAdd}
                                disabled={!canAdd}
                                className="flex-1 rounded-full bg-subsonic-accent px-6 py-3 text-sm font-black uppercase text-subsonic-bg hover:bg-subsonic-text transition disabled:opacity-40 disabled:hover:bg-subsonic-accent"
                            >
                                {outOfStock ? "Sin existencias" : "Añadir al carrito"}
                            </button>
                        </div>

                        <p className="mt-3 text-xs text-subsonic-muted">
                            {outOfStock
                                ? "Este producto no puede añadirse hasta que haya stock."
                                : purchaseOptions.length > 0
                                    ? "Selecciona cantidad y las opciones del producto."
                                    : "Selecciona la cantidad para añadir el producto."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;
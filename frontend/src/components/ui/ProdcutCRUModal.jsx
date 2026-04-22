import React, { useEffect, useState } from 'react';
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";

const emptyProduct = {
    id: '',
    name: '',
    type: '',
    price: '',
    stock: 0,
    description: '',
};

const normalizeProductId = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

const mergeProductWithDefaults = (product = {}) => ({
    ...emptyProduct,
    ...product,
    price: product.price ?? '',
    stock: Number(product.stock ?? 0),
    description: product.description ?? '',
});

const ProdcutCRUModal = ({ isOpen, onClose, onSave, product }) => {
    const [productData, setProductData] = useState(emptyProduct);
    const [stockToAdd, setStockToAdd] = useState(0);

    useEffect(() => {
        if (product) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setProductData(mergeProductWithDefaults(product));
            setStockToAdd(0);
        } else {
            setProductData({ ...emptyProduct });
            setStockToAdd(0);
        }
    }, [product, isOpen]);

    useEffect(() => {
        if (!product) {
            const generatedId = normalizeProductId(productData.name);
            if (generatedId && productData.id !== generatedId) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setProductData((prev) => ({
                    ...prev,
                    id: generatedId,
                }));
            }
        }
    }, [product, productData.name, productData.id]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProductData((prev) => ({
            ...prev,
            [name]: name === 'price' ? value : value,
        }));

        if (!product && name === 'name') {
            setProductData((prev) => ({
                ...prev,
                name: value,
                id: normalizeProductId(value),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const baseStock = product ? Number(productData.stock ?? 0) : 0;
        const parsedStockToAdd = Number(stockToAdd || 0);

        onSave?.({
            ...productData,
            price: Number(productData.price),
            stock: product ? baseStock + parsedStockToAdd : 0,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-subsonic-border bg-subsonic-navfooter shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-subsonic-border px-6 py-4">
                    <h2 className="text-xl font-black uppercase tracking-tight text-subsonic-accent">
                        {product ? 'Editar producto' : 'Nuevo producto'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-lg text-subsonic-muted hover:text-subsonic-text"
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                            label="Nombre"
                            name="name"
                            value={productData.name}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                            required
                        />

                        <Input
                            label="ID"
                            name="id"
                            value={productData.id}
                            onChange={handleChange}
                            placeholder="nombre-del-producto"
                            required
                        />

                        <Input
                            label="Tipo"
                            name="type"
                            value={productData.type}
                            onChange={handleChange}
                            placeholder="ropa / accesorio / etc."
                            required
                        />

                        <Input
                            label="Precio"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={productData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-subsonic-muted">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Descripción del artista"
                            className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
                        />
                    </div>

                    {product && (
                        <div className="rounded-xl border border-subsonic-border bg-subsonic-surface/40 p-4">
                            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-subsonic-accent">
                                Stock actual y entrada de mercancía
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-lg border border-subsonic-border bg-subsonic-navfooter px-4 py-3">
                                    <p className="text-sm text-subsonic-muted">Stock actual</p>
                                    <p className="text-2xl font-black text-subsonic-text">
                                        {Number(productData.stock ?? 0)}
                                    </p>
                                </div>

                                <Input
                                    label="Añadir stock"
                                    name="stockToAdd"
                                    type="number"
                                    min="0"
                                    value={stockToAdd}
                                    onChange={(e) => setStockToAdd(Number(e.target.value))}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    )}

                    {!product && (
                        <div className="rounded-xl border border-subsonic-border bg-subsonic-surface/40 p-4">
                            <p className="text-sm text-subsonic-muted">
                                En la creación, el stock se asignará automáticamente a <span className="font-bold text-subsonic-text">0</span>.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-subsonic-border pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-subsonic-accent px-5 py-2 text-subsonic-bg"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-subsonic-accent px-5 py-2 text-subsonic-bg"
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProdcutCRUModal;
import { useMemo, useEffect, useState, useCallback } from "react";
import ShopCard from "@/components/ui/ShopCard.jsx";
import MerchCategoryBar from "@/components/layout/MerchBar.jsx";
import PurchaseSummary from "@/components/ui/PurchaseSummary.jsx";


const parsePrice = (price) => Number(String(price).replace("€", "").replace(",", "."));

const normalizeOptions = (selectedOptions = {}) =>
    Object.entries(selectedOptions)
        .sort(([a], [b]) => a.localeCompare(b))
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

const buildCartItemKey = (productName, selectedOptions = {}) =>
    `${productName}__${JSON.stringify(normalizeOptions(selectedOptions))}`;

function Merch() {

    // 1) Categorías
    const categories = useMemo(
        () => [
            { id: "nuevo", label: "Nuevo" },
            { id: "ropa", label: "Ropa" },
            { id: "accesorios", label: "Accesorios" },
            { id: "libros", label: "Libros" },
            { id: "perfumes", label: "Perfumes" },
            { id: "posters", label: "Posters" },
        ],
        []
    );

    // 2) Estado: categoría seleccionada
    const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? "ropa");
    const [searchTerm, setSearchTerm] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3) Carga de Productos
    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:3000/merchandising');

            if (!response.ok) {
                setError(`Error HTTP: ${response.status} - ${response.statusText}`);
                setProducts([]);
                return;
            }

            const data = await response.json();

            if (!data) {
                setError('El archivo JSON está vacío');
                setProducts([]);
                return;
            }

            const productsArray = Array.isArray(data) ? data : (data.products || []);
            setProducts(productsArray);

        } catch (err) {
            console.error('Error cargando productos:', err);
            setError('No se pudieron cargar los productos. Verifica que el archivo JSON exista en public/data/');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts().catch(err => {
            console.error('Error inesperado en loadProducts:', err);
            setError('Error inesperado al cargar los productos');
            setLoading(false);
        });
    }, [loadProducts]);

    const totalCartUnits = useMemo(
        () => cartItems.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0),
        [cartItems]
    );

    const handleAddToCart = ({ product, quantity, selectedOptions }) => {
        const normalizedOptions = normalizeOptions(selectedOptions);
        const itemKey = buildCartItemKey(product.name, normalizedOptions);
        const unitPrice = parsePrice(product.price);

        setCartItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.key === itemKey);

            if (existingItem) {
                return currentItems.map((item) => {
                    if (item.key !== itemKey) {
                        return item;
                    }
                    const newQuantity = item.quantity + quantity;
                    return {
                        ...item,
                        quantity: newQuantity,
                        totalPrice: item.unitPrice * newQuantity,
                    };
                });
            }

            return [
                ...currentItems,
                {
                    key: itemKey,
                    productName: product.name,
                    productCategory: product.category,
                    quantity,
                    unitPrice,
                    totalPrice: unitPrice * quantity,
                    selectedOptions: normalizedOptions,
                },
            ];
        });
    };

    const updateCartItemQuantity = (itemKey, nextQuantity) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.key === itemKey
                        ? {
                            ...item,
                            quantity: nextQuantity,
                            totalPrice: item.unitPrice * nextQuantity,
                        }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleIncreaseItem = (itemKey) => {
        const target = cartItems.find((item) => item.key === itemKey);
        if (!target || target.quantity > 19) return;
        updateCartItemQuantity(itemKey, target.quantity + 1);
    };

    const handleDecreaseItem = (itemKey) => {
        const target = cartItems.find((item) => item.key === itemKey);
        if (!target) return;
        updateCartItemQuantity(itemKey, target.quantity - 1);
    };

    // 4) Filtrado por categoría seleccionada
    const visibleProducts = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();

        return products
            .filter((p) => {
                if(!p) return false
                const ids = Array.isArray(p.categoryId) ? p.categoryId : [p.categoryId];
                return ids.includes(activeCategoryId);
            })
            .filter((p) => {
                if (!q) return true;
                const haystack = `${p.name ?? ""}`.toLowerCase();
                return haystack.includes(q);
            });
    }, [products, activeCategoryId, searchTerm]);

    if (loading) {
        return <div className="text-center py-8">Cargando productos...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-subsonic-text">{error}</div>;
    }

    return (
        <section className="space-y-6 -mt-6 md:-mt-16">
            {/* Barra merch */}
            <div className="-mx-6 md:-mx-16">
                <MerchCategoryBar
                    categories={categories}
                    activeCategoryId={activeCategoryId}
                    onChangeCategory={setActiveCategoryId}
                    searchValue={searchTerm}
                    onChangeSearch={setSearchTerm}
                    onOpenPurchaseSummary={() => setIsSummaryOpen(true)}
                    cartCount={totalCartUnits}
                />
            </div>

            <header>
                <h1 className="text-4xl font-su text-subsonic-accent">Merchandising</h1>
                <p className="text-subsonic-muted">Productos de ensueño de tus festivales favoritos</p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProducts.map((p) => (
                    <ShopCard
                        key={p.id}
                        name={p.name}
                        category={p.categoryLabel}
                        price={p.price}
                        description={p.description}
                        purchaseOptions={p.purchaseOptions}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>

            <PurchaseSummary
                open={isSummaryOpen}
                items={cartItems}
                onClose={() => setIsSummaryOpen(false)}
                onIncreaseItem={handleIncreaseItem}
                onDecreaseItem={handleDecreaseItem}
            />
        </section>
    );
}

export default Merch;



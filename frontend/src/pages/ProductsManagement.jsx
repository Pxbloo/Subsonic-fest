import React, {useEffect, useState, useMemo} from 'react';
import ProductCRUModal from "@/components/ui/ProdcutCRUModal.jsx";
import API_BASE_URL from "@/config/api.js";
import Button from "@/components/ui/Button.jsx";
import SearchBar from "@/components/ui/SearchBar.jsx";
import ConfirmDialog from "@/components/ui/ConfirmDialog.jsx";
import { getAuth } from "firebase/auth";

const ProductsManagement = () => {

    const [products, setProducts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedProd, setSelectedProd] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/merchandising`);

            if (!response.ok) {
                console.error('Failed to fetch products:', response.statusText);
            }
            const data = await response.json();
            setProducts(data);
        }
        catch (error) {
            console.error('Error fetching products:', error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) return products;

        return products.filter((product) => [
                product.id,
                product.name,
                product.type
            ]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(term))
        );
    }, [searchTerm, products]);

    //Manejar creación de productos
    const handleNew = () => {
        setSelectedProd(null)
        setModalOpen(true);
    }

    const handleEdit = (product) => {
        setSelectedProd(product);
        setModalOpen(true);
    };

    const handleSaveProduct = async (productData) => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                throw new Error('No user is currently logged in or user is not authenticated.');
            }

            const token = await currentUser.getIdToken();

            if (selectedProd) {
                const response = await fetch(`${API_BASE_URL}/merchandising/${selectedProd.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(productData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Request failed: ${response.status} ${errorText}`);
                }
            } else {
                const response = await fetch(`${API_BASE_URL}/merchandising`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...productData,
                        stock: 0
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Request failed: ${response.status} ${errorText}`);
                }
            }

            setModalOpen(false);
            await fetchProducts();
        }
        catch (error) {
            console.error('Error saving product:', error);
        }
    };

    // Manejar el borrado de productos
    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            const response = await fetch(`${API_BASE_URL}/merchandising/${confirmDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok){
                console.error('Failed to delete product:', response.statusText);
            }
            await fetchProducts();
            setConfirmDelete(null);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    if(loading) {
        return <div className="text-center p-8">Cargando productos...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-subsonic-accent uppercase tracking-tight">
                    Gestión de Productos
                </h1>
                <Button
                    onClick={handleNew}
                    className="border border-subsonic-border text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:border-subsonic-bg transition"
                >
                    + Nuevo Producto
                </Button>
            </div>
            <div className="mb-6 max-w-md">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar por nombre, id, categoría..."
                    showButton={false}
                    className="w-full"
                    inputClassName="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text
                     placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
                />
            </div>

            <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-subsonic-border">
                    <thead className="bg-subsonic-surface/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Cantidad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-subsonic-border">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <tr key={product.id} className="hover:bg-subsonic-surface/20 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{product.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{product.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{product.price} €</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    <Button
                                        onClick={() => handleEdit(product)}
                                        className="bg-subsonic-border text-subsonic-accent hover:text-opacity-80 hover:bg-subsonic-accent hover:text-subsonic-bg px-6 py-2"
                                        variant=''
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        onClick={() => setConfirmDelete({ id: product.id, name: product.name })}
                                        className="bg-subsonic-border text-red-400 hover:bg-red-500 hover:text-subsonic-bg px-6 py-2"
                                        variant=''
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-10 text-center text-sm text-subsonic-muted">
                                No se encontraron productos con ese filtro.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear/editar productos */}
            <ProductCRUModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveProduct}
                product={selectedProd}
            />

            {/* Diálogo de confirmación para eliminar */}
            <ConfirmDialog
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                title="Eliminar producto"
                message={`¿Estás seguro de que deseas eliminar el producto "${confirmDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

export default ProductsManagement;
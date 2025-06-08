import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';
import { fetchProducts } from '../../services/api';
import CreateProduct from './createProduct';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    category: string;
    createdById: number;
    updatedById?: number;
    createdAt: string;
    updatedAt?: string;
}

const Products = () => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, csrfToken } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !csrfToken) return;
            setLoading(true);
            try {
                const response = await fetchProducts(csrfToken);
                setProducts(response.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, csrfToken]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Product Management
                            </h1>
                            <p className="text-gray-600 text-lg">Manage your product inventory and catalog</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                    {products.length}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">Total Products</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Stock</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {products.filter(p => p.stock > 0).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {products.filter(p => p.stock === 0).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Categories</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {new Set(products.map(p => p.category)).size}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Product Catalog</h2>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {products.length} items
                            </span>
                        </div>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-800 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Product
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold text-gray-700">Loading Products...</h3>
                            <p className="text-gray-500 mt-2">Please wait while we fetch the product data</p>
                        </div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div 
                                key={product.id} 
                                onClick={() => navigate(`/product/${product.id}`)} 
                                className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 group transform hover:scale-105"
                            >
                                <div className="flex flex-col h-full">
                                    {/* Product Image */}
                                    <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300 overflow-hidden">
                                        {product.imageUrl ? (
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <svg className="w-16 h-16 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                            {product.description}
                                        </p>

                                        {/* Category */}
                                        <div className="mb-3">
                                            <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                                                {product.category}
                                            </span>
                                        </div>

                                        {/* Price and Stock */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-2xl font-bold text-green-600">Rs.{product.price}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                product.stock > 0 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>

                                        {/* Action Button */}
                                        <button className="w-full mt-3 py-2 bg-blue-800 hover:bg-blue-500 text-white rounded-lg font-medium transition-all duration-200 group-hover:shadow-md">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first product</p>
                        <button
                            onClick={() => setOpen(true)}
                            className="px-6 py-3 bg-blue-800 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Create First Product
                        </button>
                    </div>
                )}

                {/* Create Product Modal */}
                {open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">Create New Product</h2>                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                    title="Close modal"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>                            <CreateProduct />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default Products;
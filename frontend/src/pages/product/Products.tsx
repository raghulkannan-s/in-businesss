import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';
import { fetchProducts } from '../../services/api';

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

    const { user, csrfToken } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async () => {
            try {
                if (user && csrfToken) {
                     const response = await fetchProducts(csrfToken);
                     setProducts(response.data || []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };
        fetchData();
    },[user, csrfToken]);

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.length > 0 ? products.map(product => (
                    <li key={product.id} onClick={()=> navigate(`/product/${product.id}`)} className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-300">
                        <div className="flex flex-col space-y-3">
                            <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">{product.name}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-green-600">${product.price}</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full w-fit">{product.category}</span>
                        </div>
                    </li>
                )) : (
                    <li className="text-gray-500">No products available</li>
                )}
            </ul>
        </div>
    );

}

export default Products;
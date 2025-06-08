

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { fetchProductById, deleteProduct } from '../../services/api';
import UpdateProduct from './UpdateProduct';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  createdByPhone?: string;
  updatedByPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { csrfToken, user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !csrfToken) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetchProductById(id, csrfToken);
        setProduct(response.product || response);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, csrfToken]);

  const deleteProductHandle = async () => {
    if (!id || !csrfToken) return;

    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      await deleteProduct(id, csrfToken);
      navigate('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-100';
    if (stock < 10) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getStockIcon = (stock: number) => {
    if (stock === 0) return '❌';
    if (stock < 10) return '⚠️';
    return '✅';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading Product...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch the product details</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className=" min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <button 
              onClick={() => navigate('/products')} 
              className="hover:text-blue-600 transition-colors"
            >
              Products
            </button>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                  </svg>
                  <p className="text-gray-500 font-medium">No Image Available</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="mb-4">
                <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm px-4 py-2 rounded-full font-medium mb-4">
                  {product.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price and Stock */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="text-sm font-medium text-green-600 mb-2">Price</div>
                  <div className="text-3xl font-bold text-green-600">Rs.{product.price}</div>
                </div>

                <div className={`text-center p-6 rounded-xl border-2 ${getStockColor(product.stock)}`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">{getStockIcon(product.stock)}</span>
                    <div className="text-sm font-medium">Stock Level</div>
                  </div>
                  <div className="text-3xl font-bold">{product.stock}</div>
                  <div className="text-sm mt-1">
                    {product.stock === 0 ? 'Out of Stock' : 
                     product.stock < 10 ? 'Low Stock' : 'In Stock'}
                  </div>
                </div>
              </div>
            </div>            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                {user && ['admin'].includes(user.role) && (
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setShowUpdateModal(true)}
                  className="flex-1 bg-blue-500  hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Edit Product
                </button>
                 <button className="w-full p-4 bg-red-100 hover:bg-red-800 text-red-800 hover:text-red-100 font-semibold rounded-lg transition-all duration-200 border border-red-200"
                onClick={deleteProductHandle}>
                  Delete Product
                </button>
              </div>)}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid lg:grid-cols-2 gap-8">          {/* Product Metadata */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Product Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg">
                <span className="text-gray-600 font-medium">Product ID</span>
                <span className="font-semibold text-gray-800">#{product.id}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg">
                <span className="text-gray-600 font-medium">Created</span>
                <span className="font-semibold text-gray-800">
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              {product.updatedAt && (
                <div className="flex justify-between items-center p-4 bg-purple-100 rounded-lg">
                  <span className="text-gray-600 font-medium">Last Updated</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center p-4 bg-yellow-100 rounded-lg">
                <span className="text-gray-600 font-medium">Created By</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800">{product.createdByPhone}</span>                  <button 
                    className="px-4 py-2 bg-gradient-to-r cursor-pointer from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-blue-600"
                    onClick={() => navigate(`/user/phone/${product.createdByPhone}`)}
                  >
                    View User
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Update Product Modal */}
        {showUpdateModal && product && (
          <UpdateProduct
            product={product}
            onClose={() => setShowUpdateModal(false)}
            onSuccess={(updatedProduct) => {
              setProduct(updatedProduct);
              setShowUpdateModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
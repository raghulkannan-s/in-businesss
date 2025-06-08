export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchProducts = async (csrfToken: string) => {
  try {
    const response = await fetch(`${API_URL}/product/getAll`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export const deleteProduct = async (id: string, csrfToken: string) => {
  try {
    const response = await fetch(`${API_URL}/product/delete`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

interface Product {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    category: string;
}

export const createProduct = async (productData: Product, csrfToken: string) => {
  try {
    const response = await fetch(`${API_URL}/product/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    return error;
  }
}

export const fetchProductById = async (id: string, csrfToken: string) => {
  try {
    const response = await fetch(`${API_URL}/product/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export const updateProduct = async (productData: Partial<Product>, csrfToken: string) => {
  try {
    const response = await fetch(`${API_URL}/product/update`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}
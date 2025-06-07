
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
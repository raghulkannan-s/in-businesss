

export const getCsrfToken = async (): Promise<string> => {
    try {
        const response = await fetch('http://localhost:3000/api/csrf-token');
        const data = await response.json();

        if (data.csrfToken) {
            return data.csrfToken;
        }
        throw new Error('Failed to get CSRF token');
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};
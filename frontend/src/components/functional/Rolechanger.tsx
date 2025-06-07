import { useState } from 'react';
import Spinner from '../ui/Spinner';
import { useAuth } from '../../hooks/useAuth';

const RoleChanger = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ message: '', color: 'gray' });
    const parsedId = parseInt(id);
    const { csrfToken } = useAuth();

    const onPromote = async () => {
        const sure = window.confirm('Are you sure you want to promote this user?');
        if (!sure) {
            return;
        }
        setLoading(true);
        setData({ message: '', color: 'gray' });

        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/admin/promote', {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ id: parsedId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            setData(responseData);
        } catch (error) {
            console.error("Error promoting user:", error);
            setData({ 
                message: 'Failed to promote user. Please try again.', 
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    const onDemote = async () => {
        const sure = window.confirm('Are you sure you want to demote this user?');
        if (!sure) {
            return;
        }
        setLoading(true);
        setData({ message: '', color: 'gray' });

        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/admin/demote', {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ id: parsedId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            setData(responseData);
        } catch (error) {
            console.error("Error demoting user:", error);
            setData({ 
                message: 'Failed to demote user. Please try again.', 
                color: 'red' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Role Management</h3>
                    <p className="text-sm text-gray-500">Manage user permissions and access levels</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                    onClick={onPromote}
                    disabled={loading || !csrfToken}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    {loading ? 'Processing...' : 'Promote User'}
                </button>
                
                <button
                    onClick={onDemote}
                    disabled={loading || !csrfToken}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                    {loading ? 'Processing...' : 'Demote User'}
                </button>
            </div>

            {/* Status Messages */}
            {data.message && (
                <div className={`p-4 rounded-lg border-l-4 ${
                    data.color === 'red' 
                        ? 'bg-red-50 border-red-400 text-red-700' 
                        : data.color === 'green' 
                        ? 'bg-green-50 border-green-400 text-green-700' 
                        : 'bg-gray-50 border-gray-400 text-gray-700'
                }`}>
                    <div className="flex items-center gap-2">
                        {data.color === 'red' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        {data.color === 'green' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        <span className="font-medium">{data.message}</span>
                    </div>
                </div>
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="flex items-center justify-center py-4">
                    <Spinner />
                    <span className="ml-3 text-gray-600">Processing request...</span>
                </div>
            )}
        </div>
    );
};

export default RoleChanger;

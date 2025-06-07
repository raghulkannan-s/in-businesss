import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScoreUpdater from "../../components/functional/ScoreUpdater";
import { useAuth } from "../../hooks/useAuth";
import RoleChanger from "../../components/functional/Rolechanger";

interface UserData {
    id: string;
    email: string;
    name: string;
    score: number;
    phone: string;
    role: string;
    eligibility: boolean;
    createdAt: string;
    updatedAt: string;
}

const User = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { csrfToken } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                setError("User ID not provided");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        'X-CSRF-Token': csrfToken
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch user: ${response.status}`);
                }

                const data = await response.json();
                setSelectedUser(data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setError("Failed to load user data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (csrfToken) {
            fetchUser();
        }
    }, [id, csrfToken]);

    const handleScoreUpdate = (newScore: number) => {
        setSelectedUser((prev) => prev ? { ...prev, score: newScore } : null);
    };

    const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-700 bg-green-100 border-green-300';
    if (score === 0) return 'text-blue-700 bg-blue-100 border-blue-300';
    return 'text-red-700 bg-red-100 border-red-300';
  };

    if (loading) {
        return (
            <div className=" min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto mt-2 ml-2"></div>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading Profile</h2>
                    <p className="text-gray-600">Please wait while we fetch the user data...</p>
                </div>
            </div>
        );
    }

    if (error || !selectedUser) {
        return (
            <div className=" min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The requested user could not be found."}</p>
                    <button
                        onClick={() => navigate('/users')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className=" min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/users')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Users
                    </button>
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-blue-800 px-8 py-12 relative">
                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                            {/* User Info */}
                            <div className="text-center lg:text-left flex-1">
                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <h1 className=" text-4xl lg:text-5xl font-bold text-white mb-3">{selectedUser.name || 'Anonymous User'}</h1>
                                    <div className={` w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                        selectedUser.eligibility ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                        {selectedUser.eligibility ? '✓' : '✗'}
                                    </div>
                                </div>
                                <p className="text-blue-100 text-xl mb-4">{selectedUser.email}</p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                    <span className="px-6 py-3 bg-white backdrop-blur-md rounded-full text-blue-950 text-sm font-medium border shadow-lg flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                        ID: {selectedUser.id}
                                    </span>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center capitalize ${
                                        selectedUser.role === 'admin' ? 'bg-red-500' :
                                        selectedUser.role === 'manager' ? 'bg-orange-500' : 'bg-blue-500'
                                    } text-white`}>
                                        {selectedUser.role}
                                    </span>
                                    <span className={`px-4 py-2 rounded-full text-sm flex items-center font-medium ${getScoreColor(selectedUser.score)}`}>
                                        Score: {selectedUser.score}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Personal Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 border border-gray-200 hover:border-blue-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Email Address</p>
                                            <p className="font-semibold text-sm text-gray-800">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 transition-all duration-300 border border-gray-200 hover:border-green-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                            <p className="font-semibold text-gray-800">{selectedUser.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Created Date */}
                                <div className="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-purple-100 transition-all duration-300 border border-gray-200 hover:border-purple-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Member Since</p>
                                            <p className="font-semibold text-gray-800">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 transition-all duration-300 border border-gray-200 hover:border-orange-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Last Updated</p>
                                            <p className="font-semibold text-gray-800">{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Score Updater */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Score Management</h2>
                            </div>
                            
                            <ScoreUpdater 
                                userId={selectedUser.id}
                                currentScore={selectedUser.score} 
                                onScoreUpdate={handleScoreUpdate}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Current Score</span>
                                    <span className="font-bold text-yellow-600">{selectedUser.score}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Eligibility</span>
                                    <span className={`font-bold ${selectedUser.eligibility ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedUser.eligibility ? 'Eligible' : 'Not Eligible'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Role</span>
                                    <span className="font-bold text-blue-600 capitalize">{selectedUser.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Role Management */}
                        <RoleChanger id={selectedUser.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;
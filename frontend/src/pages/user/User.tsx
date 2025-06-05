import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import ScoreUpdater from "../../components/ScoreUpdater";
import { useAuth } from "../../hooks/useAuth";

const User = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedUser, setSelectedUser] = useState<object>({
    "id": 0,
    "email": "Email",
    "name": "Name",
    "score": 0,
    "phone": "1234567890",
    "role": "admin",
    "eligibility": true,
    "createdAt": "2025-02-28T20:22:35.777Z",
    "updatedAt": "2025-02-28T21:46:01.909Z"
});
    const { csrfToken } = useAuth();

    useEffect(() => {
     fetch(import.meta.env.VITE_API_URL + `/user/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-Token': csrfToken
        },
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedUser(data);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
      });
    }, [id, csrfToken])

    const handleScoreUpdate = (newScore: number) => {
        setSelectedUser((prev: any) => ({
            ...prev,
            score: newScore
        }));
    };

  return (
    <div className="ml-64 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        {selectedUser ? (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white relative">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold">
                                {selectedUser.name?.charAt(0).toUpperCase() || selectedUser.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-bold mb-2">{selectedUser.name || 'Anonymous User'}</h1>
                                <p className="text-blue-100 text-lg">{selectedUser.email}</p>                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                        ID: {selectedUser.id}
                                    </span>
                                    {selectedUser.role && (
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                                            {selectedUser.role}
                                        </span>
                                    )}
                                    {selectedUser.score !== undefined && (
                                        <ScoreUpdater 
                                            userId={selectedUser.id} 
                                            currentScore={selectedUser.score} 
                                            onScoreUpdate={handleScoreUpdate}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
                                    Personal Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">📧</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{selectedUser.email}</p>
                                        </div>
                                    </div>

                                    {selectedUser.name && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">👤</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Name</p>
                                                <p className="font-medium">{selectedUser.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.phone && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">📱</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-medium">{selectedUser.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.score !== undefined && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">⭐</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Score</p>
                                                <p className="font-medium">{selectedUser.score}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.eligibility !== undefined && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                selectedUser.eligibility ? 'bg-green-500' : 'bg-red-500'
                                            }`}>
                                                <span className="text-white text-sm">✓</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Eligibility</p>
                                                <p className={`font-medium ${
                                                    selectedUser.eligibility ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {selectedUser.eligibility ? 'Eligible' : 'Not Eligible'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Details */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-500 pb-2">
                                    Account Details
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">🆔</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">User ID</p>
                                            <p className="font-medium">{selectedUser.id}</p>
                                        </div>
                                    </div>

                                    {selectedUser.role && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">👥</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Role</p>
                                                <p className="font-medium capitalize">{selectedUser.role}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.createdAt && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">📅</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Created At</p>
                                                <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.updatedAt && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">🔄</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Last Updated</p>
                                                <p className="font-medium">{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading user profile...</p>
                </div>
            </div>
        )}
    </div>
  )
}

export default User
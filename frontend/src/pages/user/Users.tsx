import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "user" | "manager" | "admin";
  score: number;
  createdAt?: string;
  updatedAt?: string;
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
    case "manager":
      return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
    case "user":
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getScoreColor = (score: number) => {
  if (score > 0) return "text-green-600 font-bold";
  if (score == 0) return "text-yellow-600 font-bold";
  if (score < 0) return "text-red-600 font-bold";
  return "text-orange-600 font-bold";
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [filteredUsers, setfilteredUsers] = useState<User[]>([]);

  const { csrfToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    if (Array.isArray(users)) {
      setfilteredUsers(users);
      if (selectedRole) {
        const roles = ['admin', 'manager', 'user'];
        if (roles.includes(selectedRole)) {
          const returnedUsers = users.filter(user => user.role === selectedRole);
          setfilteredUsers(returnedUsers);
        }
      }
    }
  }, [selectedRole, users]);

  const getUserById = (id: number) => {
        navigate(`/user/${id}`);
      };
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/user/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        'X-CSRF-Token': csrfToken
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("API response is not an array:", data);
          setUsers([]);
        }
        setLoading(false);
      })
      .catch((error) =>{
         setLoading(false)
         setUsers([]);
         console.error("Failed to fetch users:", error);
        });
  }, [csrfToken]);    return (
        <div className="ml-80 min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                User Management
                            </h1>
                            <p className="text-gray-600 text-lg">Manage and monitor all system users</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                    {Array.isArray(users) ? users.length : 0}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">Total Users</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Administrators</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Managers</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {Array.isArray(users) ? users.filter(u => u.role === 'manager').length : 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Regular Users</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {Array.isArray(users) ? users.filter(u => u.role === 'user').length : 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="sm:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                title="Filter users by role"
                                aria-label="Filter users by role"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Administrator</option>
                                <option value="manager">Manager</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>
                </div>        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-700">Loading Users...</h3>
              <p className="text-gray-500 mt-2">Please wait while we fetch the user data</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">User Directory</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{Array.isArray(filteredUsers) ? filteredUsers.length : 0}</div>
                  <div className="text-blue-100 text-sm">Showing</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0}</div>
                  <div className="text-blue-100 text-sm">Admins</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{Array.isArray(users) ? users.filter(u => u.role === 'manager').length : 0}</div>
                  <div className="text-blue-100 text-sm">Managers</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{Array.isArray(users) ? users.filter(u => u.role === 'user').length : 0}</div>
                  <div className="text-blue-100 text-sm">Users</div>
                </div>
              </div>
            </div>
            
            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">#</span>
                        </div>
                        <span>ID</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>Name</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <span>Phone</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>Role</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <span>Score</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">                  {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer group" 
                        onClick={() => getUserById(user.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                              {user.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg font-medium">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 bg-orange-50 px-3 py-2 rounded-lg font-medium">
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-md ${getRoleBadgeColor(user.role)}`}>
                            <span className="capitalize">{user.role}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-bold ${getScoreColor(user.score)} bg-white px-3 py-1 rounded-lg shadow-sm`}>
                              {user.score}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.score >= 80 ? 'Excellent' :
                               user.score >= 60 ? 'Good' :
                               user.score >= 40 ? 'Average' : 'Poor'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Users Found</h3>
                          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
  </div>
  );
};

export default Users;
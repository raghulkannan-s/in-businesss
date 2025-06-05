import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
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
  }, [csrfToken]);
    return (    <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      <div className="container mx-auto px-6 py-10 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-blue-800 mb-3">
                👥 User Management
              </h1>
              <p className="text-gray-600 text-lg font-medium">Manage and monitor all system users</p>
            </div>
            <div className="flex items-center space-x-4"><div className="bg-blue-800 text-white px-6 py-3 rounded-2xl shadow-xl border flex flex-col justify-center items-center border-white/20 backdrop-blur-sm">
                <span className="text-sm font-medium opacity-90">Total Users</span>
                <p className="text-3xl font-bold">{Array.isArray(users) ? users.length : 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
         <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4">
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    title="Filter by role"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">            {/* Stats Bar */}
            <div className="bg-blue-800 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0}</div>
                  <div className="text-purple-100 text-sm">Admins</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{Array.isArray(users) ? users.filter(u => u.role === 'manager').length : 0}</div>
                  <div className="text-purple-100 text-sm">Managers</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{Array.isArray(users) ? users.filter(u => u.role === 'user').length : 0}</div>
                  <div className="text-purple-100 text-sm">Users</div>
                </div>
              </div>
            </div>
            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-500">🆔</span>
                        <span>ID</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">👤</span>
                        <span>Name</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-500">📧</span>
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-500">📱</span>
                        <span>Phone</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <span className="text-indigo-500">👑</span>
                        <span>Role</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">⭐</span>
                        <span>Eligibility Score</span>
                      </div>
                    </th>
                  </tr>
                </thead><tbody className="divide-y divide-gray-100">
                  {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gradient-to-r cursor-pointer hover:from-blue-50 hover:to-purple-50 transition-all duration-200" onClick={() => {
                        getUserById(user.id);
                      }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black font-medium bg-orange-50 px-3 py-1 rounded-full inline-block">
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-bold ${getRoleBadgeColor(user.role)} shadow-lg`}>
                            <span className="ml-1 capitalize">{user.role}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-xl text-center font-bold ${getScoreColor(user.score)}`}>
                              {user.score}
                            </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          {loading ? "Loading users..." : "No users found"}
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
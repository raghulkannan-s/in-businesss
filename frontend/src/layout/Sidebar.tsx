import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdAccountCircle, MdDashboard } from "react-icons/md";
import SideBarBtn from "../components/SidebarBtn";

export default function Sidebar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const isActive = (path: string) => location.pathname === path;    return (
        <aside className="w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white fixed left-0 top-0 flex flex-col shadow-2xl border-r border-slate-700/30 z-50 backdrop-blur-sm">
            {/* Header */}
            <header className="px-8 py-8 border-b border-slate-700/50">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <MdDashboard className="text-2xl text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            IN Business
                        </h2>
                        <p className="text-sm text-slate-400 font-medium">Admin Panel</p>
                    </div>
                </div>
                
                {/* User Info */}
                {user && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl border border-slate-600/30 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-white truncate">
                                {user.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-slate-300 capitalize">
                                {user.role}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-xs text-green-400 font-medium">Online</span>
                            </div>
                        </div>
                    </div>
                )}
            </header>            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
                        Main Menu
                    </p>
                    
                    <Link 
                        to="/" 
                        className={`block rounded-lg transition-all duration-200 ${
                            isActive('/') 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                                : 'hover:bg-slate-800/50 hover:translate-x-1'
                        }`}
                    >
                        <SideBarBtn
                            icon={<FaHome className="text-lg" />}
                            name="Dashboard"
                        />
                    </Link>

                    <Link 
                        to="/users" 
                        className={`block rounded-lg transition-all duration-200 ${
                            isActive('/users') 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                                : 'hover:bg-slate-800/50 hover:translate-x-1'
                        }`}
                    >
                        <SideBarBtn
                            icon={<FaUser className="text-lg" />}
                            name="Users"
                        />
                    </Link>

                    <Link 
                        to="/account" 
                        className={`block rounded-lg transition-all duration-200 ${
                            isActive('/account') 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                                : 'hover:bg-slate-800/50 hover:translate-x-1'
                        }`}
                    >
                        <SideBarBtn
                            icon={<MdAccountCircle className="text-lg" />}
                            name="My Account"
                        />
                    </Link>
                </div>

                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
                        Settings
                    </p>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full block rounded-lg cursor-pointer hover:bg-red-600/20 hover:translate-x-1 transition-all duration-200 group"
                        title="Logout from account"
                    >
                        <SideBarBtn
                            icon={<FaSignOutAlt className="text-lg group-hover:text-red-400" />}
                            name="Logout"
                        />
                    </button>
                </div>
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>&copy; {new Date().getFullYear()} IN Business</span>
                    <span className="bg-slate-800 px-2 py-1 rounded text-xs">v1.0</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                    Admin Dashboard
                </div>
            </div>
        </aside>
    );
}
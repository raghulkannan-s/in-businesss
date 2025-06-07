import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { FaCartShopping } from "react-icons/fa6";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdAccountCircle, MdDashboard } from "react-icons/md";
import SideBarBtn from "../components/ui/SidebarBtn";

export default function Sidebar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }


   return (
        <aside className={`${!user ? 'hidden' : ''} w-56 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white left-0 top-0 flex flex-col shadow-2xl border-r border-slate-700/30 z-50 backdrop-blur-sm`}>
            {/* Header */}
            <header className="px-8 py-8 border-b border-slate-700/50">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg">
                        <MdDashboard className="text-2xl text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            IN Business
                        </h2>
                        <p className="text-sm text-slate-400 font-medium">Admin Panel</p>
                    </div>
                </div>
            </header>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <div className="mb-6">
                    { user && (
                        <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
                            Main Menu
                        </p>
                            <Link 
                        to="/" 
                        className={`block rounded-lg transition-all duration-200 hover:bg-slate-800/50 hover:translate-x-1`}
                    >
                        <SideBarBtn
                            icon={<FaHome className="text-lg" />}
                            name="Dashboard"
                        />
                    </Link>
                    <Link
                        to="/products"
                        className={`block rounded-lg transition-all duration-200 hover:bg-slate-800/50 hover:translate-x-1`}
                    >
                        <SideBarBtn
                            icon={<FaCartShopping className="text-lg" />}
                            name="Products"
                        />
                    </Link>
                    <Link 
                        to="/account" 
                        className={`block rounded-lg transition-all duration-200 hover:bg-slate-800/50 hover:translate-x-1`}
                    >
                        <SideBarBtn
                            icon={<MdAccountCircle className="text-lg" />}
                            name="My Account"
                        />
                    </Link>
                        </div>
                    )}
                    {user && user.role === 'admin' && (
                        <Link
                        to="/users"
                        className={`block rounded-lg transition-all duration-200 hover:bg-slate-800/50 hover:translate-x-1`}
                    >
                        <SideBarBtn
                            icon={<FaUser className="text-lg" />}
                            name="Users"
                        />
                    </Link>
                    )}

                </div>

                    { user && (
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
                    )}
            </nav>

            <div className="px-6 py-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>&copy; {new Date().getFullYear()} IN Business</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                    Admin Dashboard
                </div>
            </div>
        </aside>
    );
}
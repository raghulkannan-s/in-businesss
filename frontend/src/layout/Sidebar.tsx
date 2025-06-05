import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { FaHome, FaUser } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import SideBarBtn from "../components/SidebarBtn";


export default function Sidebar() {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <aside className="w-64 h-full bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white fixed left-0 top-0 flex flex-col shadow-xl">
            <header className="p-8 border-b border-blue-800 flex items-center gap-3">
                <h2 className="text-2xl font-extrabold tracking-wide font-sans">
                    Admin Dashboard
                </h2>
            </header>
            <nav className="flex flex-col gap-3 mt-8">
                <Link to="/" className="p-2 hover:bg-blue-800 transition">
                    <SideBarBtn
                        icon={<FaHome />}
                        name="Home"
                    />
                </Link>
                <Link to="/users" className="p-2 hover:bg-blue-800 transition">
                    <SideBarBtn
                        icon={<FaUser />}
                        name="Users"
                    />
                </Link>
                <Link to="/account" className="p-2 hover:bg-blue-800 transition">
                    <SideBarBtn
                        icon={<MdAccountCircle />}
                        name="Account"
                    />
                </Link>
            </nav>
            <div className="mt-auto p-6 flex flex-col items-center gap-2 text-gray-300">
                <button className="hover:text-blue-100 transition cursor-pointer" onClick={handleLogout}>Logout</button>
                <p className="text-xs text-blue-300 opacity-70">&copy; {new Date().getFullYear()} IN Admin</p>
            </div>
        </aside>
    );
}
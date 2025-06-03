import { Link } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import SideBarBtn from "../components/SidebarBtn";

export default function Sidebar() {
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
            </nav>
            <div className="mt-auto p-6 text-xs text-blue-300 opacity-70">
                &copy; {new Date().getFullYear()} IN Admin
            </div>
        </aside>
    );
}
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [health, setHealth] = useState<{ status?: string; message?: string }>({});
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL);
                const data = await response.json();
                setHealth(data);
            } catch (e) {
                console.log(e);
                setHealth({ status: "error", message: "Failed to fetch health status" });
            }
        };
        fetchHealth();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 ">
            <div className="bg-white/90 rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center">
                <div className="flex items-center mb-6">
                    <svg className="w-12 h-12 text-blue-500 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <h1 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>
                </div>
                <p className="text-lg text-gray-600 mb-8 text-center">
                    Welcome to your admin dashboard. Manage your business efficiently and monitor system health below.
                </p>
                <div className="w-full flex flex-col items-center">
                    <span className="uppercase text-xs text-gray-400 tracking-widest mb-2">System Health</span>
                    <div className={`flex items-center gap-2 px-6 py-4 rounded-xl shadow-inner w-full justify-center
                        ${health.status === "ok" ? "bg-green-100" : "bg-red-100"}
                    `}>
                        {health.status === "ok" && (
                            <svg className="w-6 h-6 text-green-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {health.status === "error" && (
                            <svg className="w-6 h-6 text-red-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span className="text-base font-medium text-gray-700">
                            {health.message ? health.message : "Checking health..."}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
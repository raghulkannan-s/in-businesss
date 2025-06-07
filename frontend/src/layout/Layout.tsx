
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(()=>{
        if(!user){
            navigate('/login')
        }
    }, [user])
  return (
    <div className="flex min-h-screen bg-gray-50">
      {user && <Sidebar />}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;

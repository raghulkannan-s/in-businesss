import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {user && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;

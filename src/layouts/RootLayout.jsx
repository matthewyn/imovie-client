import CustomNavbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function RootLayout() {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith("/account");

  return (
    <AuthProvider>
      <div>
        <CustomNavbar />
        <div className="flex">
          {showSidebar && <Sidebar />}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
}

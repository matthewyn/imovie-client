import CustomNavbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";
import { useFCM } from "../hooks/useFCM";
import LiveChat from "../components/LiveChat";

export default function RootLayout() {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith("/account");

  // Initialize FCM notifications
  useFCM((payload) => {
    if (payload.data?.type === "order_update") {
    }
  });

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
        <LiveChat />
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
}

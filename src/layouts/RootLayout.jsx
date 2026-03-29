import CustomNavbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";
import { useFCM } from "../hooks/useFCM";

export default function RootLayout() {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith("/account");

  // Initialize FCM notifications
  useFCM((payload) => {
    console.log("Notification payload:", payload);
    // Handle notification data here - e.g., refresh orders, update UI, etc.
    if (payload.data?.type === "order_update") {
      // Refetch orders or update UI
      console.log("Order updated:", payload.data);
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
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
}

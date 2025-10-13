import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar/Sidebar";
import { Navbar } from "./navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

interface ProtectedRoutesProps {
  showNavbar?: boolean;
  showSidebar?: boolean;
}

export function ProtectedRoute({
  showNavbar = true,
  showSidebar = true,
}: ProtectedRoutesProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [windowWidth]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-2 gap-1">
      {showNavbar && (
        <Navbar
          onMenuClick={() => {
            setIsSidebarOpen((prev) => {
              return !prev;
            });
          }}
          onLogout={() => {
            handleLogout();
          }}
        />
      )}

      <div
        className={`flex flex-1 overflow-hidden ${
          showSidebar && isSidebarOpen ? "gap-1" : "gap-0"
        }`}
      >
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => {
              setIsSidebarOpen(false);
            }}
          />
        )}

        <main className="flex-1 overflow-y-auto shadow-sm transition-all duration-300 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar/Sidebar";
import { Navbar } from "./navbar/Navbar";
import { Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [windowWidth]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-2 gap-1">
      <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />

      <div
        className={`flex flex-1 overflow-hidden ${
          isSidebarOpen ? "gap-1" : "gap-0"
        }`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto shadow-sm transition-all duration-300 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

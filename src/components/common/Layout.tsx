import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { SIDEBAR_ITEMS } from "../../constants/theme";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selectedPath =
    SIDEBAR_ITEMS.find((item) => item.path === location.pathname)?.path || "";

  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen min-h-screen overflow-hidden box-border">
      {/* Desktop Sidebar */}
      <Sidebar
        onItemClick={(path) => navigate(path)}
        selectedPath={selectedPath}
        onSignInClick={() => navigate("/login")}
        className="hidden min-h-screen p-6 md:flex flex-col justify-between transition-all duration-200"
      />
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            style={{
              background: "linear-gradient(to bottom, #000 60%, #222 100%)",
            }}
            className="relative w-full h-full flex flex-col justify-between z-50 animate-slide-in-left"
          >
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={handleCloseSidebar}
              aria-label="Cerrar menú"
            >
              ×
            </button>
            <div className="w-full h-full p-10">
              <Sidebar
                onItemClick={(path) => {
                  handleCloseSidebar();
                  navigate(path);
                }}
                selectedPath={selectedPath}
                onSignInClick={() => navigate("/login")}
                className="flex w-full md:hidden flex-col justify-between"
                mobile={true}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 h-full">
        <main className="flex items-center justify-center flex-1 h-0 max-h-full min-h-0 p-6 overflow-y-auto bg-gray-100">
          <div className="w-full h-full">
            <div className="w-full flex md:hidden flex-row-reverse">
              <button
                className="p-2 text-2xl"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menú"
              >
                <RxHamburgerMenu />
              </button>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

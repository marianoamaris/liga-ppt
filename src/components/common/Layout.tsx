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
    <div className="box-border flex h-screen min-h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        onItemClick={(path) => navigate(path)}
        selectedPath={selectedPath}
        onSignInClick={() => navigate("/login")}
        className="flex-col justify-between hidden min-h-screen p-6 transition-all duration-200 md:flex"
      />
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            style={{
              background: "linear-gradient(to bottom, #000 60%, #222 100%)",
            }}
            className="relative z-50 flex flex-col justify-between w-full h-full animate-slide-in-left"
          >
            <button
              className="absolute text-2xl text-white top-4 right-4"
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
                className="flex flex-col justify-between w-full md:hidden"
                mobile={true}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 h-full">
        <main className="flex items-center justify-center flex-1 h-0 max-h-full min-h-0 overflow-y-auto bg-gray-100 md:p-6">
          <div className="w-full h-full">
            <div className="flex flex-row-reverse w-full md:hidden">
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

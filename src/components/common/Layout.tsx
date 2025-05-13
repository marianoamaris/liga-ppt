import React from "react";
import { Sidebar } from "./Sidebar";
import { SIDEBAR_ITEMS } from "../../constants/theme";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPath =
    SIDEBAR_ITEMS.find((item) => item.path === location.pathname)?.path || "";

  return (
    <div className="flex h-screen min-h-screen overflow-hidden">
      <Sidebar
        onItemClick={(path) => navigate(path)}
        selectedPath={selectedPath}
        onSignInClick={() => navigate("/login")}
      />
      <div className="flex flex-col flex-1 h-full">
        <main className="flex items-center justify-center flex-1 h-0 max-h-full min-h-0 p-6 overflow-y-auto bg-gray-100">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

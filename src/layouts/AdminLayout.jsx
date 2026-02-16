import { useState } from "react";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-[#F3FFF7] min-h-screen">
      {/* Sidebar */}
      <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      {/* <main
        className={`
          
          ${collapsed ? "pl-16" : "p-0"}
          min-h-screen
          transition-all duration-300
          md:${collapsed ? "ml-20" : "ml-72"}
        `}
      >
        <Outlet />
      </main> */}
      <main
        className={`
    min-h-screen
    transition-all
    duration-300
    ${collapsed ? "pl-16 md:ml-20" : "p-0 md:ml-72"}
  `}
      >
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;

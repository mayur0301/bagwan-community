import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Heart,
  Video,
  Megaphone,
  CheckCircle,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  HandHeart,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../public/Logo.png";
import {
  useLoginAdminMutation,
  useLogoutAdminMutation,
} from "../redux/Admin/AdminApi";
import { toast } from "react-toastify";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/" },
  { name: "User Management", icon: Users, to: "/usermanagement" },
  { name: "Support Requests", icon: Heart, to: "/supportrequests" },
  { name: "Donation Support", icon: HandHeart, to: "/donationsupport" },
  { name: "Videos management", icon: Video, to: "/videosmanagement" },
  { name: "Updates & News", icon: Megaphone, to: "/updatesnews" },
  { name: "Support Categories", icon: CheckCircle, to: "/supportcategories" },
  { name: "Bulk messaging", icon: MessageCircle, to: "/bulkmessaging" },
];

const SideBar = ({ collapsed, setCollapsed }) => {
  // const [collapsed, setCollapsed] = useState(false);
  const AdminContact = localStorage.getItem("contact");
  const [logoutadmin, { isLoading }] = useLogoutAdminMutation();
  const [openAdminMenu, setOpenAdminMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // async function Logout() {
  //   try {
  //     const res = await logoutadmin();
  //     if (res.error) {
  //       toast.error("Error In Logout");
  //     } else {
  //       toast.success("Logout Done");
  //       localStorage.clear();
  //       window.location.href = "/login";
  //     }
  //   } catch (error) {
  //     toast.error("Error In Logout");
  //   }
  // }
  async function Logout() {
    try {
      const res = await logoutadmin();
      if (res.error) {
        toast.error("Error In Logout");
      } else {
        toast.success("Logout Done");
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error In Logout");
    }
  }

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
    fixed top-0 left-0 h-screen z-50
    transition-all duration-300
    bg-gradient-to-b from-[#6BAE3D] to-[#13773A]

    ${collapsed ? "w-20" : "w-72"}
    ${mobileOpen ? "left-0" : "-left-full md:left-0"}

    flex flex-col
    overflow-hidden
  `}
      >
        {/* LOGO */}
        <div className="relative px-4 pt-6 pb-8 flex justify-center">
          <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-md">
            <img
              src={Logo}
              alt="Bagwan Community"
              className={`${collapsed ? "w-10" : "w-12"} transition-all`}
            />

            {!collapsed && (
              <div className="leading-tight hidden sm:block">
                <p className="text-[#5ACD0B] font-bold text-lg">Bagwan</p>
                <p className="text-[#5ACD0B] font-bold text-lg">Community</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute pr-5 -right-4 top-1/2 -translate-y-1/2
  bg-[#5ACD0B] text-white p-2 rounded-full shadow-lg hidden md:block"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* MOBILE CLOSE */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-2 right-2 text-white md:hidden"
          >
            ✕
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              text-white
              ${
                isActive
                  ? "bg-gradient-to-r from-[#212121] to-[#5ACD0B] shadow-lg border-l-4"
                  : "hover:bg-white/10"
              }`
                }
              >
                <Icon size={22} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* USER */}
        <div className="relative border-t border-white/20 p-4">
          <div
            onClick={() => setOpenAdminMenu(!openAdminMenu)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5ACD0B] font-bold">
              A
            </div>

            {!collapsed && (
              <div className="text-white text-sm leading-tight hidden sm:block">
                <p className="font-semibold">Admin</p>
                <p className="text-xs opacity-80">{AdminContact}</p>
              </div>
            )}
          </div>

          {/* DROPDOWN */}
          {openAdminMenu && !collapsed && (
            <div className="absolute bottom-16 left-4 right-4 bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={Logout}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 bg-green-600 text-white p-2 rounded-lg shadow-lg md:hidden"
      >
        ☰
      </button>
    </>
  );
};

export default SideBar;

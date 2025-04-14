
import React from "react";
import { Link } from "react-router-dom";
import SidebarLogo from "./SidebarLogo";
import NavLink from "./NavLink";
import { getActiveNavItems } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import SidebarUserDropdown from "./SidebarUserDropdown";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const activeNavItems = getActiveNavItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarLogo className="w-24" />
          
          <div className="hidden md:flex space-x-4">
            {activeNavItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className="text-sm hover:text-purple-200 transition-colors"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <SidebarUserDropdown isCollapsed={false} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

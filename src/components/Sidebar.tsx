
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import SidebarNavItems from '@/components/navigation/SidebarNavItems';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { liftTheVeil } = useTheme();
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <aside 
      className={`
        fixed left-0 top-0 bottom-0 z-40 
        ${isCollapsed ? 'w-16' : 'w-64'} 
        transition-all duration-300 ease-in-out 
        ${liftTheVeil ? 'bg-black/80' : 'bg-black/80'}
        border-r ${liftTheVeil ? 'border-pink-900/30' : 'border-purple-900/30'}
        backdrop-blur-lg
      `}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="p-4 flex items-center justify-between border-b border-purple-900/30">
          {!isCollapsed && (
            <div className="text-white font-medium truncate">Sacred Shifter</div>
          )}
          
          <button 
            onClick={toggleSidebar}
            className={`
              p-1 rounded-full 
              ${liftTheVeil ? 'text-pink-400' : 'text-purple-400'}
              hover:bg-white/10
              ${isCollapsed ? 'ml-auto mr-auto' : ''}
            `}
          >
            <ChevronRight 
              className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} 
            />
          </button>
        </div>
        
        {/* Sidebar nav items */}
        <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <SidebarNavItems 
            isCollapsed={isCollapsed} 
            onLinkClick={() => setIsCollapsed(true)}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

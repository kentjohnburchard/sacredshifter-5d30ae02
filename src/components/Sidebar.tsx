
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import SidebarNavItems from '@/components/navigation/SidebarNavItems';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    // Handle responsive collapse state on resize
    const handleResize = () => {
      if (window.innerWidth < 1024 && !isCollapsed) {
        setIsCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <aside 
      className={`
        fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out backdrop-blur-lg
        ${isCollapsed ? 'w-0 md:w-16' : 'w-64'} 
      `}
      style={{
        background: 'rgba(10, 10, 18, 0.85)',
        borderRight: `1px solid ${liftTheVeil ? 'rgba(232, 122, 208, 0.2)' : 'rgba(155, 135, 245, 0.2)'}`,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div 
          className="p-4 flex items-center justify-between border-b transition-colors duration-300"
          style={{
            borderColor: liftTheVeil ? 'rgba(232, 122, 208, 0.2)' : 'rgba(155, 135, 245, 0.2)'
          }}
        >
          {!isCollapsed && (
            <div 
              className="font-medium truncate bg-clip-text text-transparent bg-gradient-to-r transition-colors duration-300"
              style={{
                backgroundImage: liftTheVeil 
                  ? 'linear-gradient(to right, rgba(232, 122, 208, 1), rgba(232, 122, 208, 0.8))'
                  : 'linear-gradient(to right, rgba(155, 135, 245, 1), rgba(155, 135, 245, 0.8))'
              }}
            >
              Sacred Shifter
            </div>
          )}
          
          <button 
            onClick={toggleSidebar}
            className={`
              p-1.5 rounded-full transition-all duration-300
              hover:bg-white/10
              ${isCollapsed ? 'ml-auto mr-auto hidden md:block' : ''}
            `}
            style={{
              color: liftTheVeil ? 'rgba(232, 122, 208, 1)' : 'rgba(155, 135, 245, 1)'
            }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight 
              className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} 
            />
          </button>
        </div>
        
        {/* Mobile toggle button (outside the sidebar) */}
        <button
          className="fixed md:hidden top-4 left-4 z-50 bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-lg border border-white/10"
          onClick={toggleSidebar}
          style={{
            color: liftTheVeil ? 'rgba(232, 122, 208, 1)' : 'rgba(155, 135, 245, 1)'
          }}
          aria-label={isCollapsed ? 'Show menu' : 'Hide menu'}
        >
          <ChevronRight 
            className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} 
          />
        </button>
        
        {/* Sidebar nav items */}
        <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <SidebarNavItems 
            isCollapsed={isCollapsed} 
            onLinkClick={() => window.innerWidth < 1024 && setIsCollapsed(true)}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

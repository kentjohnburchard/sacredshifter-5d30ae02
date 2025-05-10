
import React from 'react';
import { useLocation } from 'react-router-dom';
import SacredLayout from './SacredLayout';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showPlayer?: boolean;
  showChatBubble?: boolean;
  pageTitle?: string;
  chakraColor?: string;
  className?: string;
}

/**
 * AppShell - Legacy wrapper around SacredLayout for backward compatibility
 * This ensures existing pages using AppShell still work with the new theme
 */
const AppShell: React.FC<AppShellProps> = ({
  children,
  showSidebar = true,
  showPlayer = true,
  showChatBubble = true,
  pageTitle = 'Sacred Shifter',
  chakraColor,
  className = '',
}) => {
  return (
    <SacredLayout
      pageTitle={pageTitle}
      showSidebar={showSidebar}
      showPlayer={showPlayer}
      showWatermark={true}
      chakraColor={chakraColor}
      themeIntensity="medium"
      className={className}
    >
      {children}
    </SacredLayout>
  );
};

export default AppShell;

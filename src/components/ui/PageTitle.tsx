
import React from 'react';

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ children, className = '' }) => {
  return (
    <h1 className={`text-3xl font-bold mb-6 ${className}`}>
      {children}
    </h1>
  );
};

export default PageTitle;

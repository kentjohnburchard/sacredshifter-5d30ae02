
import { useParams, useNavigate, useLocation, NavLink } from 'react-router-dom';

/**
 * useRoute - A lightweight alias to get route context using React Router
 */
export function useRoute() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  return {
    path: location.pathname,
    params,
    push: (to: string) => {
      // Ensure we're not just refreshing the current page
      if (location.pathname === to) {
        console.log('Preventing navigation to same route:', to);
        return;
      }
      
      // Prevent default navigation behavior
      setTimeout(() => {
        navigate(to);
      }, 0);
    },
    replace: (to: string) => navigate(to, { replace: true }),
    isActive: (route: string) => location.pathname === route,
  };
}

/**
 * Link - A NavLink wrapper for consistent styling and active state
 * Prevents default anchor behavior to avoid page refreshes
 */
export const Link: React.FC<{
  to: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  replace?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({
  to,
  className = '',
  activeClassName = '',
  children,
  replace = false,
  onClick,
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default anchor behavior
    
    if (onClick) {
      onClick(e);
      return;
    }
    
    navigate(to, { replace });
  };

  return (
    <NavLink
      to={to}
      replace={replace}
      onClick={handleClick}
      className={({ isActive }) =>
        `${className} ${isActive && activeClassName ? activeClassName : ''}`
      }
    >
      {children}
    </NavLink>
  );
};

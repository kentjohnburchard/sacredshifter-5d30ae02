// src/utils/RouterHelpers.tsx (or rename as needed)

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
    push: navigate,
    replace: (to: string) => navigate(to, { replace: true }),
    isActive: (route: string) => location.pathname === route,
  };
}

/**
 * Link - A NavLink wrapper for consistent styling and active state
 */
export const Link: React.FC<{
  to: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  replace?: boolean;
  onClick?: () => void;
}> = ({
  to,
  className = '',
  activeClassName = '',
  children,
  replace = false,
  onClick,
}) => {
  return (
    <NavLink
      to={to}
      replace={replace}
      onClick={onClick}
      className={({ isActive }) =>
        `${className} ${isActive && activeClassName ? activeClassName : ''}`
      }
      aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
    >
      {children}
    </NavLink>
  );
};

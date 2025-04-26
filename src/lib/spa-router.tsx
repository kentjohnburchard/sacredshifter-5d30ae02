
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";

type Params = Record<string, string | undefined>;

interface RouteObject {
  path: string; // e.g. "/about", "/song/:id"
  element: ReactNode;
  children?: RouteObject[];
}

interface RouterContextProps {
  path: string;
  params: Params;
  push: (to: string) => void;
  replace: (to: string) => void;
  isActive: (route: string) => boolean;
}

const RouterContext = createContext<RouterContextProps | undefined>(undefined);

function pathToRegexp(path: string) {
  // Convert "/visualiser/:songId" -> regex, extract param keys
  const keys: string[] = [];
  let pattern = path.replace(/\/:([^/]+)/g, (_, key) => {
    keys.push(key);
    return "/([^/]+)";
  });
  pattern = "^" + pattern.replace(/\//g, "\\/") + "$";
  return { regex: new RegExp(pattern), keys };
}

function matchPath(routePath: string, location: string): { matched: boolean, params: Params } {
  const { regex, keys } = pathToRegexp(routePath);
  const match = location.match(regex);
  if (!match) return { matched: false, params: {} };
  const params: Params = {};
  keys.forEach((key, i) => {
    params[key] = match[i + 1];
  });
  return { matched: true, params };
}

function findMatchedRoute(
  routes: RouteObject[],
  location: string
): { element: ReactNode, params: Params } | null {
  for (const route of routes) {
    const { matched, params } = matchPath(route.path, location);
    if (matched) {
      if (route.children) {
        // Check for nested routes with remainder path
        const rest = location.replace(
          new RegExp(pathToRegexp(route.path).pattern),
          ""
        );
        if (rest && rest !== "") {
          const nested = findMatchedRoute(route.children, rest.startsWith("/") ? rest : "/" + rest);
          if (nested) return nested;
        }
      }
      return { element: route.element, params };
    } else if (route.children) {
      const nested = findMatchedRoute(route.children, location);
      if (nested) return nested;
    }
  }
  return null;
}

/**
 * RouterProvider - Context and top-level router for SPA navigation
 */
export const RouterProvider: React.FC<{ routes: RouteObject[], children?: ReactNode }> = ({
  routes,
  children,
}) => {
  const [path, setPath] = useState(window.location.pathname);
  const [params, setParams] = useState<Params>({});

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Find match for rendering and param extraction
  const match = findMatchedRoute(routes, path);

  const push = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };
  const replace = (to: string) => {
    window.history.replaceState({}, "", to);
    setPath(to);
  };
  const isActive = (route: string) => {
    const { matched } = matchPath(route, path);
    return matched;
  };

  useEffect(() => {
    if (match && match.params) setParams(match.params);
    else setParams({});
  }, [path, routes]);

  return (
    <RouterContext.Provider value={{ path, params, push, replace, isActive }}>
      {/* Render matching route component */}
      {match ? match.element : children || null}
    </RouterContext.Provider>
  );
};

/**
 * useRoute - React hook for accessing route context (path, params, navigation)
 */
export function useRoute() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRoute must be used inside <RouterProvider>");
  return ctx;
}

/**
 * Route - Helper for route config; just an identity function for TypeScript support
 */
export function Route(route: RouteObject): RouteObject {
  return route;
}

/**
 * Link - Navigation element to trigger SPA route changes
 */
export const Link: React.FC<{ to: string; className?: string; activeClassName?: string; children: ReactNode; replace?: boolean; onClick?: () => void; }> = ({
  to,
  className = "",
  activeClassName = "",
  children,
  replace = false,
  onClick,
}) => {
  const { push, replace: rep, isActive } = useRoute();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (replace) rep(to);
    else push(to);
    onClick?.();
  };
  const isActiveRoute = isActive(to);

  return (
    <a
      href={to}
      className={`${className} ${isActiveRoute ? activeClassName : ""}`}
      aria-current={isActiveRoute ? "page" : undefined}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

/**
 * Example Usage:
 * 
 * // 1. Define your routes and mapping:
 * const routes = [
 *   Route({ path: "/", element: <Home /> }),
 *   Route({ path: "/about", element: <AboutPage /> }),
 *   Route({ path: "/visualiser/:songId", element: <Visualizer /> }),
 * ];
 * 
 * // 2. Wrap your app (or main area) with <RouterProvider routes={routes}>.
 * // 3. Use <Link to="/about">About</Link> anywhere instead of <a>.
 * // 4. Use `const { params } = useRoute();` in a component to access params e.g. songId.
 * 
 * Nested Example:
 * const routes = [
 *   Route({
 *     path: "/app",
 *     element: <AppShell />,
 *     children: [
 *       Route({ path: "/app/dashboard", element: <Dashboard /> }),
 *       Route({ path: "/app/profile/:userId", element: <ProfilePage /> }),
 *     ],
 *   }),
 * ];
 */

// Export all for external usage
export type { RouteObject };

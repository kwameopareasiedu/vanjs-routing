import van from "vanjs-core";
import { _routerBasename, _routerParams, _routerPathname, _routerQuery } from "@/_state";

const _QUERY_PARAM_REGEX = /:([^\\d|^/]([^/]+)?)/;

interface Route {
  path: string | "*";
  component: () => HTMLElement;
}

interface RouterProps extends Partial<HTMLDivElement> {
  routes: Route[];
  basename?: string;
}

export function Router({ routes, basename, ...props }: RouterProps) {
  const ready = van.state(false);
  const rootElement = van.tags.div({ ...props } as never);

  /** Returns a sanitized path which with a leading slash but no trailing slashes*/
  const sanitizePath = (path: string) => {
    if (!path) return "";

    if (!path.startsWith("/")) path = "/" + path;

    while (path !== "/" && path.endsWith("/")) {
      path = path.slice(0, path.length - 1);
    }

    return path;
  };

  /** Match the current URL pathname to a route. Matching is done in the order of routes */
  const routeMatcher = (path: string, basename: string) => {
    path = sanitizePath(path);
    basename = sanitizePath(basename);

    const pathParts = path.split("/");
    const params: Record<string, string> = {};
    let matchedRoute: Route | null = null;

    for (const route of routes) {
      const routePathParts = sanitizePath(basename + route.path).split("/");
      if (routePathParts.length !== pathParts.length) continue;

      let matchFound = true;

      for (let idx = 0; idx < routePathParts.length; idx++) {
        const routePathPart = routePathParts[idx];
        const pathPart = pathParts[idx];

        if (_QUERY_PARAM_REGEX.test(routePathPart)) {
          params[decodeURIComponent(routePathPart.slice(1))] = decodeURIComponent(pathPart);
        } else if (pathPart !== routePathPart) {
          matchFound = false;
          break;
        }
      }

      if (matchFound) {
        matchedRoute = route;
        break;
      }
    }

    if (!matchedRoute) {
      // Find match-all (404) route if no match is found
      matchedRoute = routes.find(route => route.path === "*") || null;
    }

    return { route: matchedRoute, params };
  };

  const parseQuery = (search: string) => {
    if (search.startsWith("?")) search = search.slice(1).trim();
    if (!search) return {};

    const query: Record<string, string> = {};
    const groups = search.split("&");

    for (const group of groups) {
      const [key, value] = group.split("=");
      query[decodeURIComponent(key)] = decodeURIComponent(value);
    }

    return query;
  };

  const handleWindowPopState = () => {
    const { route, params } = routeMatcher(window.location.pathname, basename || "");

    if (route) {
      rootElement.replaceChildren(route.component());
      _routerQuery.val = parseQuery(window.location.search);
      _routerParams.val = params;
    }
  };

  van.derive(() => {
    window.onpopstate = handleWindowPopState;
    handleWindowPopState();
  });

  van.derive(() => {
    if (_routerPathname.val) {
      if (ready.val) {
        handleWindowPopState();
      } else ready.val = true;
    }
  });

  van.derive(() => {
    _routerBasename.val = sanitizePath(basename || "");
  });

  return rootElement;
}

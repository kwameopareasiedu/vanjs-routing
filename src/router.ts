import van from "vanjs-core";
import { _routerParams, _routerPathname } from "@/_state";

const _QUERY_PARAM_REGEX = /:([^\\d|^/]([^/]+)?)/;

interface Route {
  path: string | "*";
  component: HTMLElement;
}

interface RouterProps extends Partial<HTMLDivElement> {
  routes: Route[];
}

export function Router({ routes, ...props }: RouterProps) {
  const ready = van.state(false);
  const rootElement = van.tags.div({ ...props } as never);

  /** Match the current URL pathname to a route. Matching is done in the order of routes */
  const routeMatcher = (path: string) => {
    while (path !== "/" && path.endsWith("/")) {
      path = path.slice(0, path.length - 1);
    }

    const pathParts = path.split("/");
    const params: Record<string, string> = {};
    let matchedRoute: Route | null = null;

    for (const route of routes) {
      const routePathParts = route.path.split("/");
      if (routePathParts.length !== pathParts.length) continue;

      let matchFound = true;

      for (let idx = 0; idx < routePathParts.length; idx++) {
        const routePathPart = routePathParts[idx];
        const pathPart = pathParts[idx];

        if (_QUERY_PARAM_REGEX.test(routePathPart)) {
          params[routePathPart.slice(1)] = pathPart;
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

  const handleWindowPopState = () => {
    const { route, params } = routeMatcher(window.location.pathname);

    if (route) {
      rootElement.replaceChildren(route.component);
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

  return rootElement;
}

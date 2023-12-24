import van from "vanjs-core";
import { getRouterState, updateRouterState } from "@/state";
import { QUERY_PARAM_REGEX } from "@/utils";

interface Route {
  path: string | "*";
  component: HTMLElement;
}

interface RouterProps extends Partial<HTMLDivElement> {
  routes: Route[];
}

export function Router({ routes, ...props }: RouterProps) {
  const rootElement = van.tags.div({ ...props } as never);

  /** Match the current URL pathname to a route.
   * NB: Matching is done in the order of routes */
  const routeMatcher = (path: string) => {
    while (path.endsWith("/")) {
      path = path.slice(0, path.length - 1);
    }

    const pathParts = path.split("/");
    const params: Record<string, string> = {};
    let matchedRoute: Route | null = null;

    for (const route of routes) {
      const routePathParts = route.path.split("/");
      if (pathParts.length !== routePathParts.length) continue;

      let matchFound = true;

      for (let idx = 0; idx < pathParts.length; idx++) {
        const pathPart = pathParts[idx];
        const routePathPart = routePathParts[idx];

        if (QUERY_PARAM_REGEX.test(pathPart)) {
          params[pathPart.slice(1)] = routePathPart;
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
      updateRouterState({ params });
    }
  };

  van.derive(() => {
    window.onpopstate = handleWindowPopState;
    handleWindowPopState();
  });

  van.derive(() => {
    if (getRouterState().pathname) {
      handleWindowPopState();
    }
  });

  return rootElement;
}

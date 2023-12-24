import van from "vanjs-core";
import { getRouterState } from "@/state";

interface Route {
  path: string | "*";
  component: HTMLElement;
}

interface RouterProps extends Partial<HTMLDivElement> {
  routes: Route[];
}

export function Router({ routes, ...props }: RouterProps) {
  const rootElement = van.tags.div({ ...props } as never);

  const handleWindowPopState = () => {
    const path = window.location.pathname;
    const idx = routes.map(route => route.path).indexOf(path);
    if (idx >= 0) rootElement.replaceChildren(routes[idx].component);
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

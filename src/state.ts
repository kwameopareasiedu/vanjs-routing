import van from "vanjs-core";

interface RouterState {
  pathname: string;
  query: Record<string, string>;
  params: Record<string, string>;
}

const routerState = van.state<RouterState>({
  pathname: window.location.pathname,
  params: {},
  query: {}
});

export function getRouterState(): RouterState {
  return routerState.val;
}

export function updateRouterState(newState: Partial<RouterState>) {
  routerState.val = { ...routerState.val, ...newState };
}

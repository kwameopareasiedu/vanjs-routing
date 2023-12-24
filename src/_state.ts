import van from "vanjs-core";

export const _routerPathname = van.state(window.location.pathname);
export const _routerParams = van.state<Record<string, string>>({});
export const _routerQuery = van.state<Record<string, string>>({});

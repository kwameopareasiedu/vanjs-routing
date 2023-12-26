import { _routerBasename, _routerParams, _routerPathname, _routerQuery } from "@/_state";

export const getRouterPathname = () => _routerPathname.val;

export const getRouterParams = () => _routerParams.val;

export const getRouterQuery = () => _routerQuery.val;

export const navigate = (href: string, options?: { replace?: boolean }) => {
  const { replace } = options || {};

  if (!replace) window.history.pushState({}, "", _routerBasename.val + href);
  else window.history.replaceState({}, "", _routerBasename.val + href);

  // Update the global state of the router to trigger the Router
  _routerPathname.val = _routerBasename.val + href;
};

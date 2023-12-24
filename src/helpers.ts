import { _routerParams, _routerPathname, _routerQuery } from "@/_state";

export const getRouterPathname = () => _routerPathname.val;

export const getRouterParams = () => _routerParams.val;

export const getRouterQuery = () => _routerQuery.val;

export const navigate = (href: string, options?: { replace?: boolean }) => {
  const { replace } = options || {};

  if (!replace) window.history.pushState({}, "", href);
  else window.history.replaceState({}, "", href);
  _routerPathname.val = href;
};

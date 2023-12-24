import { _routerParams, _routerPathname, _routerQuery } from "@/_state";

export const _QUERY_PARAM_REGEX = /:([^\\d|^/]([^/]+)?)/g;

export const getRouterPathname = () => _routerPathname.val;

export const getRouterParams = () => _routerParams.val;

export const getRouterQuery = () => _routerQuery.val;

import van from 'vanjs-core';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const _routerPathname = van.state(window.location.pathname);
const _routerParams = van.state({});
const _routerQuery = van.state({});

const _QUERY_PARAM_REGEX = /:([^\\d|^/]([^/]+)?)/;
function Router(_a) {
    var { routes } = _a, props = __rest(_a, ["routes"]);
    const ready = van.state(false);
    const rootElement = van.tags.div(Object.assign({}, props));
    /** Match the current URL pathname to a route. Matching is done in the order of routes */
    const routeMatcher = (path) => {
        while (path !== "/" && path.endsWith("/")) {
            path = path.slice(0, path.length - 1);
        }
        const pathParts = path.split("/");
        const params = {};
        let matchedRoute = null;
        for (const route of routes) {
            const routePathParts = route.path.split("/");
            if (routePathParts.length !== pathParts.length)
                continue;
            let matchFound = true;
            for (let idx = 0; idx < routePathParts.length; idx++) {
                const routePathPart = routePathParts[idx];
                const pathPart = pathParts[idx];
                if (_QUERY_PARAM_REGEX.test(routePathPart)) {
                    params[routePathPart.slice(1)] = pathPart;
                }
                else if (pathPart !== routePathPart) {
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
            }
            else
                ready.val = true;
        }
    });
    return rootElement;
}

function Link(_a, ...children) {
    var { replace } = _a, props = __rest(_a, ["replace"]);
    const _b = props, { onclick, href } = _b, rest = __rest(_b, ["onclick", "href"]);
    const anchor = van.tags.a(Object.assign(Object.assign({}, rest), { href, onclick: (e) => {
            var _a;
            e.preventDefault();
            if (!replace)
                window.history.pushState({}, "", href);
            else
                window.history.replaceState({}, "", href);
            // Update the global state of the router to trigger the Router
            if (href)
                _routerPathname.val = href;
            // Call original anchor onclick, if defined
            (_a = onclick === null || onclick === void 0 ? void 0 : onclick.bind(anchor)) === null || _a === void 0 ? void 0 : _a(e);
        } }), ...children);
    return anchor;
}

const getRouterPathname = () => _routerPathname.val;
const getRouterParams = () => _routerParams.val;
const getRouterQuery = () => _routerQuery.val;
const navigate = (href, options) => {
    const { replace } = options || {};
    if (!replace)
        window.history.pushState({}, "", href);
    else
        window.history.replaceState({}, "", href);
    _routerPathname.val = href;
};

export { Link, Router, getRouterParams, getRouterPathname, getRouterQuery, navigate };

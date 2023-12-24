import van from 'vanjs-core';

const routerState = van.state({
    pathname: window.location.pathname,
    params: {},
    query: {}
});
function getRouterState() {
    return routerState.val;
}
function updateRouterState(newState) {
    routerState.val = Object.assign(Object.assign({}, routerState.val), newState);
}

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

function Router(_a) {
    var { routes } = _a, props = __rest(_a, ["routes"]);
    const rootElement = van.tags.div(Object.assign({}, props));
    const handleWindowPopState = () => {
        const path = window.location.pathname;
        const idx = routes.map(route => route.path).indexOf(path);
        if (idx >= 0)
            rootElement.replaceChildren(routes[idx].component);
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

export { Router, getRouterState, updateRouterState };

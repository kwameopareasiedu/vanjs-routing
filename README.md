# VanJS Routing

The cleanest, simplest declarative routing solution for the [VanJS](https://vanjs.org/) framework. If you are coming
from React, `vanjs-routing` feels similar to [react-router](https://npmjs.org/package/react-router).

[![](https://img.shields.io/badge/Github-Star-blue)](https://github.com/kwameopareasiedu/vanjs-routing)
[![](https://img.shields.io/badge/Size-2.2Kb-orange)](https://github.com/kwameopareasiedu/vanjs-routing)

## Install

```shell
yarn add vanjs-routing vanjs-core
```

```shell
npm i -S vanjs-routing vanjs-core
```

## Features

1. Declare routes with `Router()` using a clean, simple and concise syntax
2. Use `Link()` instead of `a()` to navigate between pages
3. Use `navigate()` in areas `Link` cannot be used. (_E.g._ In a [side-effect](https://vanjs.org/tutorial#side-effect))
4. Access the router internal state
   - Get the current pathname with `getRouterPathname()`
   - Get the dynamic URL parameters with `getRouterParams()`
   - Get the query parameters with `getRouterQuery()`
5. Supports dynamic URLs (E.g. `/help/:section/:topic`) with `getRouterParams()`
6. Supports URL prefixing using `Router.basename`. (Useful for sites like Github Pages)

## QuickStart

```typescript
import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const { div, p, button } = van.tags;

function App() {
  return Router({
    basename: "vanjs-routing", // Optional base name (All links are now prefixed with '/vanjs-routing')
    routes: [
      { path: "/", component: HomeComponent },
      { path: "/about", component: AboutComponent },
      { path: "/help/:section", component: HelpComponent }
    ]
  });
}

function HomeComponent() {
  return div(p("Home"), Link({ href: "/about?foo=bar" }, "Goto About"), Link({ href: "/help/profile" }, "Goto Help"));
}

function AboutComponent() {
  return div(p("About"), Link({ href: "/" }, "Back to Home"));
}

function HelpComponent() {
  van.derive(() => {
    console.log(getRouterParams()); // { section: "profile" }
  });

  return div(
    p("Help"),
    Link({ href: "/" }, "Back to Home"),
    button({ onclick: () => navigate("/") }, "Back to Home (Imperative navigation)")
  );
}

van.add(document.body, App());
```

## API Reference

### Router

- The `Router` component which you use to define your routes
- Each `route` is an object with a `path` and `component`
  - The `component` is a function returning an `HTMLElement`

```typescript
import { Router } from "vanjs-routing";

Router({
  basename?: string,
  routes: Array <{
    path: string,
    component: () => HTMLElement
  }>
});
```

### Link

- The `Link` extends the `van.tags.a` component to tap into the router's internal state for navigation
- `Link` is a drop-in replacement for `van.tags.a`
- If `replace` is set to `true`, the current route will be replaced with the Link's `href` when clicked

```typescript
import { Link } from "vanjs-routing";

Link({
  replace?: boolean
  // Additional van.tags.a props
});
```

### Navigate

- The `navigate` function is useful in areas where `Link` cannot be used. For example in a function or side-effect
- If `replace` is set to `true`, the current route will be replaced with `href` instead of pushing to the history stack.

```typescript
import { navigate } from "vanjs-routing";

navigate(
  href,
  options ?: {
    replace?: boolean
  }
)
```

### Router state helpers

- `getRouterPathname()` returns the current pathname
- `getRouterParams()` returns the parameter values in a dynamic route
- `getRouterQuery()` returns the query parameters

```typescript
import { getRouterPathname, getRouterParams, getRouterQuery } from "vanjs-routing";

// Route path:    /home/:section/:topic
// Current URL:   https://hello.com/home/learning/science?tab=intro

console.log(getRouterPathname()); // "/home/learning/science"
console.log(getRouterParams()); // { section: "learning", topic: "science" }
console.log(getRouterQuery()); // { tab: "intro" }
```

## Contributors

- [Kwame Opare Asiedu](https://github.com/kwameopareasiedu)

## Change Log

- `1.1.3`
  - Update `package.json` metadata and README documentation
- `1.1.2`
  - Update README documentation
- `1.1.0`
  - Added `basename` prop to `Router` component.

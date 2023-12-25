# VanJS Routing

The cleanest, simplest declarative routing solution for the [VanJS](https://vanjs.org/) framework. If you are coming
from React, `vanjs-routing` feels similar to [react-router](https://npmjs.org/package/react-router).

[![](https://img.shields.io/badge/Github-Star-blue)](https://github.com/kwameopareasiedu/vanjs-routing)

## Install

```shell
yarn add vanjs-routing vanjs-core
```

```shell
npm i -S vanjs-routing vanjs-core
```

## Features

`vanjs-routing` offers the following features:

1. Declare routes with `Router()` using a clean, simple and concise syntax
2. Use `Link()` instead of `a()` to navigate between pages
3. Use `navigate()` to **programmatically** navigate between pages. This is useful for areas `Link` cannot be used.
   (_E.g._ In a [side-effect](https://vanjs.org/tutorial#side-effect))
4. Use `getRouterPathname()`, `getRouterParams()` and `getRouterQuery()` to access the internal state of the router
   anywhere in your code.
5. Supports dynamic URLs. (E.g. For a dynamic route like `/help/:section/:topic`, use `getRouterParams()` to get the
   values of **section** and **topic** in your component)
6. Use `getRouterQuery()` to get the query params of a route. (E.g. `/about?foo=bar` returns `{ foo: "bar" }`)

## Example

Here's a minimal example of `vanjs-routing` in action

```javascript
import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const { div, p, button } = van.tags;

function App() {
  return Router({
    routes: [
      { path: "/", component: Home },
      { path: "/about", component: About },
      { path: "/help/:section", component: Section }
    ]
  });
}

function Home() {
  return div(
    p("Home"),

    Link({ href: "/about?foo=bar" }, "Goto About"),

    Link({ href: "/help/profile" }, "Goto Help")
  );
}

function About() {
  return div(
    p("About"),

    Link({ href: "/" }, "Back to Home")
  );
}

function About() {
  van.derive(() => {
    console.log(getRouterParams()); // { section: "profile" }
  });

  return div(
    p("Help"),
    Link({ href: "/" }, "Back to Home"),
    button({ onclick: () => navigate("/") }, "Back to Home (Imperative navigation)")
  );
}
```

## API Reference

`vanjs-routing` has the following exports:

| Name                                                     | Description                                                                          |
|----------------------------------------------------------|--------------------------------------------------------------------------------------|
| `Router`                                                 | The root router component. Use this to specify the routes and component functions    |
| `Link`                                                   | An extended `a` component which taps into the router's internal state for navigation |
| `navigate(href: string, options: { replace?: boolean })` | Used to perform imperative navigation in areas `Link` cannot be used                 |
| `getRouterPathname()`                                    | Returns the current pathname of the page                                             |
| `getRouterParams()`                                      | Returns an object with key-value mappings for dynamic routes                         |
| `getRouterQuery()`                                       | Returns an object with key-value mappings for query parameters                       |


## Contributors
- [Kwame Opare Asiedu](https://github.com/kwameopareasiedu)

import van from "vanjs-core";
import { getRouterQuery, Link, navigate, Router } from "vanjs-routing";

const { div, p } = van.tags;

export default function App() {
  return Router({
    basename: "/vanjs-example",
    routes: [
      { path: "/", component: Page1 },
      { path: "/second", component: Page2 },
      { path: "/third/:foo/:bar", component: Page3 }
    ]
  });
}

const Page1 = () => {
  return div(
    { className: "inline-flex flex-col justify-content-start gap-4 p-4" },
    div("First page"),
    Link({ href: "/second?foo=bar", className: "px-4 py-2 bg-green-300 rounded", replace: true }, "Goto page 2"),
    Link({ href: "/third/2/kwame", className: "px-4 py-2 bg-blue-300 rounded" }, "Goto page 3")
  );
};

const Page2 = () => {
  van.derive(() => console.log(getRouterQuery()));

  return div(
    { className: "inline-flex flex-col justify-content-start gap-4 p-4" },
    div("Second page"),
    Link({ href: "/", className: "px-4 py-2 bg-cyan-300" }, "Goto page 1")
  );
};

const Page3 = () => {
  const timer = van.state(5);

  const timerId = setInterval(() => {
    if (timer.val === 1) {
      clearInterval(timerId);
      navigate("/");
      return;
    }

    timer.val = timer.val - 1;
    console.log(timer.val);
  }, 1000);

  return div(
    { className: "inline-flex flex-col justify-content-start gap-4 p-4" },
    "Third page",
    p(() => `Navigating back in ${timer.val}s`)
  );
};

import van from "vanjs-core";
import { Link, navigate, Router } from "vanjs-router";

const { div, p } = van.tags;

export default function App() {
  return Router({
    routes: [
      { path: "/", component: Page1 },
      { path: "/second", component: Page2 },
      { path: "/third/:foo/:bar", component: Page3 }
    ]
  });
}

const Page1 = () => {
  return div(
    div("First page"),
    Link({ href: "/second", className: "px-4 py-2 bg-green-300", replace: true }, "Goto page 2"),
    Link({ href: "/third/2/kwame", className: "px-4 py-2 bg-blue-300" }, "Goto page 3")
  );
};

const Page2 = () => {
  return div(div("Second page"), Link({ href: "/", className: "px-4 py-2 bg-cyan-300" }, "Goto page 1"));
};

const Page3 = () => {
  const timer = van.state(5);

  const timerId = setInterval(() => {
    if (timer.val === 0) {
      clearInterval(timerId);
      navigate("/");
      return;
    }

    timer.val = timer.val - 1;
    console.log(timer.val);
  }, 1000);

  console.log({ timerId });

  return div(
    "Third page",
    p(() => `Navigating back in ${timer.val}s`)
  );
};

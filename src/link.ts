import van from "vanjs-core";
import { _routerPathname } from "@/_state";

interface LinkProps extends Partial<HTMLAnchorElement> {
  replace?: boolean;
}

export function Link({ replace, ...props }: LinkProps, ...children: (HTMLElement | string)[]) {
  const { onclick, href, ...rest } = props as HTMLAnchorElement;

  const anchor = van.tags.a(
    {
      ...rest,
      href,
      onclick: (e: MouseEvent) => {
        e.preventDefault();

        if (!replace) window.history.pushState({}, "", href);
        else window.history.replaceState({}, "", href);

        // Update the global state of the router to trigger the Router
        if (href) _routerPathname.val = href;
        // Call original anchor onclick, if defined
        onclick?.bind(anchor)?.(e);
      }
    },
    ...children
  );

  return anchor;
}

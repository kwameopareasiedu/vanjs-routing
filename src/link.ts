import van from "vanjs-core";
import { updateRouterState } from "@/state";

interface LinkProps extends Partial<HTMLAnchorElement> {
  replace?: boolean;
}

export function Link(props: LinkProps, ...children: (HTMLElement | string)[]) {
  const { onclick, href, ...rest } = props as HTMLAnchorElement;

  const anchor = van.tags.a(
    {
      ...rest,
      href,
      onclick: (e: MouseEvent) => {
        e.preventDefault();
        window.history.pushState({}, "", href);
        if (href) updateRouterState({ pathname: href });
        onclick?.bind(anchor)?.(e);
      }
    },
    ...children
  );

  return anchor;
}

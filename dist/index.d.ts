interface Route {
  path: string | "*";
  component: () => HTMLElement;
}

type Children = string | number | boolean | HTMLElement;

export declare const Router: (
  props: { routes: Route[] } & Partial<HTMLDivElement>,
  ...children: Children[]
) => HTMLElement;

export declare const Link: (
  props: { replace?: boolean } & Partial<HTMLAnchorElement>,
  ...children: Children[]
) => HTMLElement;

export declare const getRouterPathname: () => string;

export declare const getRouterParams: () => Record<string, string>;

export declare const getRouterQuery: () => Record<string, string>;

export declare const navigate: (href: string, options?: { replace?: boolean }) => Record<string, string>;

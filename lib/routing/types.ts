import type { UrlObject } from 'url';

export type RoutesModule = typeof import('./routes');
export type Route = RoutesModule[keyof RoutesModule];

export type StringWithBrackets<T extends string> =
  T extends `${infer _V}[${infer U}]` ? U : never;

export type HasSquareBrackets<T extends string> =
  StringWithBrackets<T> extends never ? false : true;

export type QueryInterface<T extends Route> = HasSquareBrackets<T> extends true
  ? {
      query:
        | Record<string, string | string[]>
        | Record<StringWithBrackets<T>, string | number>;
    }
  : {};

export type URL<T extends Route> =
  | (Omit<UrlObject, 'pathname' | 'query'> & {
      pathname: T;
    } & QueryInterface<T>)
  | Exclude<Route, `${string}[${string}]`>;
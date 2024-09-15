/*
Derived from: https://www.flightcontrol.dev/blog/fix-nextjs-routing-to-have-full-type-safety
*/
/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable max-params */
import { z } from 'zod';
import queryString from 'query-string';
import Link from 'next/link';
import React from 'react';

type LinkProps = Parameters<typeof Link>[0];

export interface RouteInfo<Params extends z.ZodSchema, Search extends z.ZodSchema> {
  name: string;
  params: Params;
  search: Search;
  description?: string;
}

type OptionalFields<T extends object, F extends keyof T> = Omit<T, F> & Partial<Pick<T, F>>;

type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type RouteInfoToLayout<
  Info extends OptionalFields<RouteInfo<z.ZodSchema, z.ZodSchema>, 'search'> = RouteInfo<
    z.ZodSchema,
    z.ZodSchema
  >,
> = Prettify<{
  params: z.output<Info['params']>;
  searchParams: Info['search'] extends z.ZodSchema ? z.output<Info['search']> : undefined;
}>;

interface GetInfo<Result extends z.ZodSchema> {
  result: Result;
}

interface PostInfo<Body extends z.ZodSchema, Result extends z.ZodSchema> {
  body: Body;
  result: Result;
  description?: string;
}

interface PutInfo<Body extends z.ZodSchema, Result extends z.ZodSchema> {
  body: Body;
  result: Result;
  description?: string;
}

type FetchOptions = Parameters<typeof fetch>[1];

interface CoreRouteElements<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema = typeof emptySchema,
> {
  params: z.output<Params>;
  paramsSchema: Params;
  search: z.output<Search>;
  searchSchema: Search;
}

type PutRouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Body extends z.ZodSchema,
  Result extends z.ZodSchema,
> = CoreRouteElements<Params, Search> & {
  (
    body: z.input<Body>,
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>>;

  body: z.output<Body>;
  bodySchema: Body;
  result: z.output<Result>;
  resultSchema: Result;
};

type PostRouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Body extends z.ZodSchema,
  Result extends z.ZodSchema,
> = CoreRouteElements<Params, Search> & {
  (
    body: z.input<Body>,
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>>;

  body: z.output<Body>;
  bodySchema: Body;
  result: z.output<Result>;
  resultSchema: Result;
};

type GetRouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Result extends z.ZodSchema,
> = CoreRouteElements<Params, Search> & {
  (
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>>;

  result: z.output<Result>;
  resultSchema: Result;
};

type DeleteRouteBuilder<Params extends z.ZodSchema> = CoreRouteElements<Params, z.ZodSchema> &
  ((p?: z.input<Params>, options?: FetchOptions) => Promise<void>);

export type RouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
> = CoreRouteElements<Params, Search> & {
  (p?: z.input<Params>, search?: z.input<Search>): string;

  routeName: string;

  Link: React.FC<
    Omit<LinkProps, 'href'> &
      z.input<Params> & {
        search?: z.input<Search>;
      } & { children?: React.ReactNode }
  >;
  ParamsLink: React.FC<
    Omit<LinkProps, 'href'> & {
      params?: z.input<Params>;
      search?: z.input<Search>;
    } & { children?: React.ReactNode }
  >;
};

function createPathBuilder<T extends Record<string, string | string[]>>(
  route: string,
): (params: T) => string {
  const pathArr = route.split('/');

  let catchAllSegment: ((params: T) => string) | null;
  if (pathArr.at(-1)?.startsWith('[[...')) {
    const catchKey = pathArr.pop()!.replace('[[...', '').replace(']]', '');
    catchAllSegment = (params: T) => {
      const catchAll = params[catchKey] as unknown as string[];
      return catchAll ? `/${catchAll.join('/')}` : '';
    };
  }

  const elems: ((params: T) => string)[] = [];
  for (const elem of pathArr) {
    const catchAll = elem.match(/\[\.{3}(.*)]/);
    const param = elem.match(/\[(.*)]/);
    if (catchAll?.[1]) {
      const key = catchAll[1];
      elems.push((params: T) => (params[key as unknown as string] as string[]).join('/'));
    } else if (param?.[1]) {
      const key = param[1];
      elems.push((params: T) => params[key as unknown as string] as string);
    } else if (!(elem.startsWith('(') && elem.endsWith(')'))) {
      elems.push(() => elem);
    }
  }

  return (params: T): string => {
    const p = elems.map((e) => e(params)).join('/');
    return catchAllSegment ? p + catchAllSegment(params) : p;
  };
}

function createRouteBuilder<Params extends z.ZodSchema, Search extends z.ZodSchema>(
  route: string,
  info: RouteInfo<Params, Search>,
) {
  const fn = createPathBuilder<z.output<Params>>(route);

  return (params?: z.input<Params>, search?: z.input<Search>) => {
    let checkedParams = params || {};
    if (info.params) {
      const safeParams = info.params.safeParse(checkedParams);
      if (safeParams?.success) {
        checkedParams = safeParams.data;
      } else {
        throw new Error(`Invalid params for route ${info.name}: ${safeParams.error.message}`);
      }
    }
    const safeSearch = info.search ? info.search?.safeParse(search || {}) : undefined;
    if (info.search && !safeSearch?.success) {
      throw new Error(`Invalid search params for route ${info.name}: ${safeSearch?.error.message}`);
    }

    const baseUrl = fn(checkedParams);
    const searchString = search && queryString.stringify(search);
    return [baseUrl, searchString ? `?${searchString}` : ''].join('');
  };
}

const emptySchema = z.object({});

export function makePostRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Body extends z.ZodSchema,
  Result extends z.ZodSchema,
>(
  route: string,
  info: RouteInfo<Params, Search>,
  postInfo: PostInfo<Body, Result>,
): PostRouteBuilder<Params, Search, Body, Result> {
  const urlBuilder = createRouteBuilder(route, info);

  const routeBuilder: PostRouteBuilder<Params, Search, Body, Result> = (
    body: z.input<Body>,
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>> => {
    const safeBody = postInfo.body.safeParse(body);
    if (!safeBody.success) {
      throw new Error(`Invalid body for route ${info.name}: ${safeBody.error.message}`);
    }

    return fetch(urlBuilder(p, search), {
      ...options,
      method: 'POST',
      body: JSON.stringify(safeBody.data),
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${info.name}: ${res.statusText}`);
        }
        return res.json() as Promise<z.output<Result>>;
      })
      .then((data) => {
        const result = postInfo.result.safeParse(data);
        if (!result.success) {
          throw new Error(`Invalid response for route ${info.name}: ${result.error.message}`);
        }
        return result.data;
      });
  };

  routeBuilder.params = undefined as z.output<Params>;
  routeBuilder.paramsSchema = info.params;
  routeBuilder.search = undefined as z.output<Search>;
  routeBuilder.searchSchema = info.search;
  routeBuilder.body = undefined as z.output<Body>;
  routeBuilder.bodySchema = postInfo.body;
  routeBuilder.result = undefined as z.output<Result>;
  routeBuilder.resultSchema = postInfo.result;

  return routeBuilder;
}

export function makePutRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Body extends z.ZodSchema,
  Result extends z.ZodSchema,
>(
  route: string,
  info: RouteInfo<Params, Search>,
  putInfo: PutInfo<Body, Result>,
): PutRouteBuilder<Params, Search, Body, Result> {
  const urlBuilder = createRouteBuilder(route, info);

  const routeBuilder: PutRouteBuilder<Params, Search, Body, Result> = (
    body: z.input<Body>,
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>> => {
    const safeBody = putInfo.body.safeParse(body);
    if (!safeBody.success) {
      throw new Error(`Invalid body for route ${info.name}: ${safeBody.error.message}`);
    }

    return fetch(urlBuilder(p, search), {
      ...options,
      method: 'PUT',
      body: JSON.stringify(safeBody.data),
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${info.name}: ${res.statusText}`);
        }
        return res.json() as Promise<z.output<Result>>;
      })
      .then((data) => {
        const result = putInfo.result.safeParse(data);
        if (!result.success) {
          throw new Error(`Invalid response for route ${info.name}: ${result.error.message}`);
        }
        return result.data;
      });
  };

  routeBuilder.params = undefined as z.output<Params>;
  routeBuilder.paramsSchema = info.params;
  routeBuilder.search = undefined as z.output<Search>;
  routeBuilder.searchSchema = info.search;
  routeBuilder.body = undefined as z.output<Body>;
  routeBuilder.bodySchema = putInfo.body;
  routeBuilder.result = undefined as z.output<Result>;
  routeBuilder.resultSchema = putInfo.result;

  return routeBuilder;
}

export function makeGetRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Result extends z.ZodSchema,
>(
  route: string,
  info: RouteInfo<Params, Search>,
  getInfo: GetInfo<Result>,
): GetRouteBuilder<Params, Search, Result> {
  const urlBuilder = createRouteBuilder(route, info);

  const routeBuilder: GetRouteBuilder<Params, Search, Result> = (
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>> => {
    return fetch(urlBuilder(p, search), options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${info.name}: ${res.statusText}`);
        }
        return res.json() as Promise<z.output<Result>>;
      })
      .then((data) => {
        const result = getInfo.result.safeParse(data);
        if (!result.success) {
          throw new Error(`Invalid response for route ${info.name}: ${result.error.message}`);
        }
        return result.data;
      });
  };

  routeBuilder.params = undefined as z.output<Params>;
  routeBuilder.paramsSchema = info.params;
  routeBuilder.search = undefined as z.output<Search>;
  routeBuilder.searchSchema = info.search;
  routeBuilder.result = undefined as z.output<Result>;
  routeBuilder.resultSchema = getInfo.result;

  return routeBuilder;
}

export function makeDeleteRoute<Params extends z.ZodSchema, Search extends z.ZodSchema>(
  route: string,
  info: RouteInfo<Params, Search>,
): DeleteRouteBuilder<Params> {
  const urlBuilder = createRouteBuilder(route, info);

  const routeBuilder: DeleteRouteBuilder<Params> = (
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<void> => {
    return fetch(urlBuilder(p, search), options).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${info.name}: ${res.statusText}`);
      }
    });
  };

  routeBuilder.params = undefined as z.output<Params>;
  routeBuilder.paramsSchema = info.params;
  routeBuilder.search = undefined as z.output<Search>;
  routeBuilder.searchSchema = info.search;

  return routeBuilder;
}

export function makeRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema = typeof emptySchema,
>(route: string, info: RouteInfo<Params, Search>): RouteBuilder<Params, Search> {
  const urlBuilder: RouteBuilder<Params, Search> = createRouteBuilder(route, info) as RouteBuilder<
    Params,
    Search
  >;

  urlBuilder.routeName = info.name;

  urlBuilder.ParamsLink = function RouteLink({
    params: linkParams,
    search: linkSearch,
    children,
    ...props
  }: Omit<LinkProps, 'href'> & {
    params?: z.input<Params>;
    search?: z.input<Search>;
  } & { children?: React.ReactNode }) {
    return (
      <Link {...props} href={urlBuilder(linkParams, linkSearch)}>
        {children}
      </Link>
    );
  };

  urlBuilder.Link = function RouteLink({
    search: linkSearch,
    children,
    ...props
  }: Omit<LinkProps, 'href'> &
    z.input<Params> & {
      search?: z.input<Search>;
    } & { children?: React.ReactNode }) {
    const params = info.params.parse(props);
    const extraProps = { ...props };
    for (const key of Object.keys(params)) {
      delete extraProps[key];
    }

    const searchParams = info.search.parse(linkSearch ?? {});

    return (
      <Link {...extraProps} href={urlBuilder(info.params.parse(props), searchParams)}>
        {children}
      </Link>
    );
  };

  urlBuilder.params = undefined as z.output<Params>;
  urlBuilder.paramsSchema = info.params;
  urlBuilder.search = undefined as z.output<Search>;
  urlBuilder.searchSchema = info.search;

  return urlBuilder;
}

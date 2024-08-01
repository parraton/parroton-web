import { RouteInfo, RouteInfoToLayout } from '@routes/makeRoute';
import { z } from 'zod';
import NotFound from 'next/dist/client/components/not-found-error';

export function RouteHoc<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  T extends RouteInfo<Params, Search>,
>(routeInfo: T) {
  return function (WrappedComponent: React.ComponentType<RouteInfoToLayout<T>>) {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    const ComponentWithParams = (props: RouteInfoToLayout<T>) => {
      const { params, searchParams } = props;

      const fixedParams = routeInfo.params.safeParse(params);
      const fixedSearchParams = searchParams ? routeInfo.search.safeParse(searchParams) : undefined;

      if (!fixedParams.success) {
        return <NotFound />;
      }

      return (
        <WrappedComponent
          {...props}
          params={fixedParams.data}
          searchParams={fixedSearchParams?.data}
        />
      );
    };

    ComponentWithParams.displayName = `RouteHoc(${displayName})`;

    return ComponentWithParams;
  };
}

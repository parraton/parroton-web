export type WithLocaleParams<T extends object = object> = T & {
  params: {
    lng: string;
  };
};

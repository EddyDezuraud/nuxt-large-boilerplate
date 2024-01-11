import type { RuntimeConfig } from 'nuxt/schema';
import { defu } from 'defu';
import { FetchError } from 'ofetch';
import type { UseFetchOptions } from '#app';
import type { AsyncDataRequestStatus } from '#app/composables/asyncData';

// export ce type avec le T en paramètre : <AsyncData<T, FetchError>>.
export type AsyncData<T> = {
    data: T;
    pending: boolean;
    refresh: () => Promise<T>;
    execute: () => Promise<T>;
    error: FetchError;
    status: AsyncDataRequestStatus;
    };

const reqMethods = [
  'request', 'delete', 'get', 'head', 'options', // url, config
  'post', 'put', 'patch' // url, data, config
];

const service: Record<string, Function> = {};
const baseOptions: any = {};

if (!import.meta.env.DEV && import.meta.env.VITE_PROXY === 'true') {
  baseOptions.credentials = 'include';
}

const initHeader = <T>(options: UseFetchOptions<T>, config: RuntimeConfig) => {
  const currentHeaders = useRequestHeaders(['cookie']);
  const isDev = config.public.dev;
  const isProxy = config.public.proxy;

  const headers = {
    ...baseOptions.headers,
    ...currentHeaders
  };

  // For mock mode, change put & delete methods to get
  if (isDev && !isProxy && (options.method === 'put' || options.method === 'delete')) {
    options.body = undefined;
    options.method = 'get';
  }

  // Don't send credentials if dev mock mode
  if (isProxy || !isDev) {
    options.credentials = 'include';
  }

  options.headers = { ...options.headers, ...headers };
  return options;
};

export const useFetchApi = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const config = useRuntimeConfig();
  const localOptions: UseFetchOptions<T> = initHeader(options, config);

  const params = defu(options, localOptions);

  return useFetch(url, {
    ...params,
    baseURL: config.public.APIBaseURL,
  });
};

reqMethods.forEach((method) => {
  if (['DELETE', 'GET'].includes(method.toUpperCase())) {
    service[method] = async function <T> (URL: string, options: any = {}) {
      const requestOptions = {
        ...baseOptions,
        method,
        ...options,
        body: options.body ? options.body : undefined
      };

      return useFetchApi<AsyncData<T>>(URL, requestOptions);
    };
  } else {
    service[method] = async function <T> (URL: string, body: object, options: any = {}) {
      const requestOptions = {
        ...baseOptions,
        method,
        ...options,
        body: body || undefined
      };

      return useFetchApi<AsyncData<T>>(URL, requestOptions);
    };
  }
});

const baseUrl = '/rest/admin';
export { baseUrl, service };

export default service;

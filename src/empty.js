console.log('Empty module loaded (aliased fetch/formdata polyfill)');

const isBrowser = typeof window !== 'undefined';

export const FormData = isBrowser ? window.FormData : class {};
export const fetch = isBrowser ? window.fetch : () => Promise.reject('fetch not available');
export const Request = isBrowser ? window.Request : class {};
export const Response = isBrowser ? window.Response : class {};
export const Headers = isBrowser ? window.Headers : class {};
export const File = isBrowser ? window.File : class {};
export const Blob = isBrowser ? window.Blob : class {};
export const AbortController = isBrowser ? window.AbortController : class {};
export const AbortSignal = isBrowser ? window.AbortSignal : class {};
export const formDataToBlob = () => {};

export default fetch;

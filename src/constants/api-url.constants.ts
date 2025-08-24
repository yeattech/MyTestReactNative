export const API_CONFIG = {
  BASE_URLS: {
    LOCAL: 'http://192.168.45.205:8100',
  },
};

// Change Configuration If necessary
const API_DOMAIN = API_CONFIG.BASE_URLS.LOCAL;

const API_METHOD = {
  GET: 'GET',
  POST: 'POST',
};

export interface APIEndpointDetails {
  url: string;
  method: string;
}

export const API_ENDPOINTS = {
  // TestController
  GET_STRING: {
    url: API_DOMAIN + '/mytestjavaspringbootmaven/test/string',
    method: API_METHOD.GET,
  },
  GET_STRING_WITH_RESPONSE_ENTITY: {
    url:
      API_DOMAIN +
      '/mytestjavaspringbootmaven/test/string-with-response-entity',
    method: API_METHOD.GET,
  },
  GET_LIST_STRING: {
    url: API_DOMAIN + '/mytestjavaspringbootmaven/test/list/string',
    method: API_METHOD.GET,
  },
  DELAY_5_SECONDS: {
    url: API_DOMAIN + '/mytestjavaspringbootmaven/test/delay-5-seconds',
    method: API_METHOD.GET,
  },
  SERVER_ERROR_400: {
    url: API_DOMAIN + '/mytestjavaspringbootmaven/test/client-error/400',
    method: API_METHOD.GET,
  },
  SERVER_ERROR_500: {
    url: API_DOMAIN + '/mytestjavaspringbootmaven/test/server-error/500',
    method: API_METHOD.GET,
  },
};

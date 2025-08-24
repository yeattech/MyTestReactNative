import { API_ENDPOINTS } from '../constants/api-url.constants';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  ok: boolean;
}

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

export class FetchService {
  private static async makeRequest<T>(
    endpoint: string,
    method: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { headers = {}, body } = options;

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(endpoint, requestOptions);
      const data = await response.json();

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      };
    } catch (error) {
      throw new Error(`Fetch request failed: ${error}`);
    }
  }

  // Generic method for any endpoint
  static async request<T>(
    endpoint: keyof typeof API_ENDPOINTS,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const endpointConfig = API_ENDPOINTS[endpoint];
    return this.makeRequest<T>(
      endpointConfig.url,
      endpointConfig.method,
      options,
    );
  }

  // Specific methods for each endpoint
  static async getString(): Promise<ApiResponse<string>> {
    return this.request('GET_STRING');
  }

  static async getStringWithResponseEntity(): Promise<ApiResponse<any>> {
    return this.request('GET_STRING_WITH_RESPONSE_ENTITY');
  }

  static async getListString(): Promise<ApiResponse<string[]>> {
    return this.request('GET_LIST_STRING');
  }

  static async getDelay5Seconds(): Promise<ApiResponse<any>> {
    return this.request('DELAY_5_SECONDS');
  }

  static async getServerError400(): Promise<ApiResponse<any>> {
    return this.request('SERVER_ERROR_400');
  }

  static async getServerError500(): Promise<ApiResponse<any>> {
    return this.request('SERVER_ERROR_500');
  }

  // Custom request method for flexibility
  static async customRequest<T>(
    url: string,
    method: string = 'GET',
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, method, options);
  }
}

export const fetchService = new FetchService();

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

    // Log request details
    console.log(`REQUEST [${endpoint}]:`, {
      method: method,
      endpoint: endpoint,
      options: options,
    });

    const response = await fetch(endpoint, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Log response details
    console.log(`RESPONSE [${endpoint}]:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data: data,
    });

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    };
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

  // Custom request method for flexibility
  static async sendRequest<T>(
    url: string,
    method: string = 'GET',
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, method, options);
  }
}

export const fetchService = new FetchService();

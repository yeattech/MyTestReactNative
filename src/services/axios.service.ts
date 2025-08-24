import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '../constants/api-url.constants';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  success: boolean;
}

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class AxiosService {
  private static instance: AxiosService;
  private axiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000, // 10 seconds default timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      config => {
        // You can add authentication tokens here
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      error => {
        // Handle common errors here
        if (error.response) {
          // Server responded with error status
          console.error('Response error:', error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error('Request error:', error.request);
        } else {
          // Something else happened
          console.error('Error:', error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }
    return AxiosService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { headers = {}, body, timeout } = options;

    const config: AxiosRequestConfig = {
      method: method.toLowerCase(),
      url: endpoint,
      headers,
      timeout: timeout || 10000,
    };

    if (body && method !== 'GET') {
      config.data = body;
    }

    try {
      const response: AxiosResponse<T> = await this.axiosInstance(config);

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        success: true,
      };
    } catch (error: any) {
      return {
        data: error.response?.data || null,
        status: error.response?.status || 0,
        statusText: error.response?.statusText || error.message,
        success: false,
      };
    }
  }

  // Generic method for any endpoint
  async request<T>(
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
  async getString(): Promise<ApiResponse<string>> {
    return this.request('GET_STRING');
  }

  async getStringWithResponseEntity(): Promise<ApiResponse<any>> {
    return this.request('GET_STRING_WITH_RESPONSE_ENTITY');
  }

  async getListString(): Promise<ApiResponse<string[]>> {
    return this.request('GET_LIST_STRING');
  }

  async getDelay5Seconds(): Promise<ApiResponse<any>> {
    return this.request('DELAY_5_SECONDS');
  }

  async getServerError400(): Promise<ApiResponse<any>> {
    return this.request('SERVER_ERROR_400');
  }

  async getServerError500(): Promise<ApiResponse<any>> {
    return this.request('SERVER_ERROR_500');
  }

  // Custom request method for flexibility
  async customRequest<T>(
    url: string,
    method: string = 'GET',
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, method, options);
  }

  // Method to update base URL if needed
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  // Method to set default headers
  setDefaultHeaders(headers: Record<string, string>): void {
    this.axiosInstance.defaults.headers.common = {
      ...this.axiosInstance.defaults.headers.common,
      ...headers,
    };
  }
}

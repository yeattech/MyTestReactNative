import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import {
  API_ENDPOINTS,
  APIEndpointDetails,
} from '../constants/api-url.constants';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  success: true;
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

  // Method to send requests using endpoint keys
  public async sendRequest<T>(
    endpoint: APIEndpointDetails,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const endpointConfig = endpoint;

    // Log request details
    console.log(`REQUEST [${endpointConfig.url}]:`, {
      method: endpointConfig.method,
      endpoint: endpoint,
      options: options,
    });

    const response = await this.makeRequest<T>(
      endpointConfig.url,
      endpointConfig.method,
      options,
    );

    // Log response details
    console.log(`RESPONSE [${endpointConfig.url}]:`, {
      status: response.status,
      statusText: response.statusText,
      success: response.success,
      data: response.data,
    });

    return response;
  }

  // Static convenience method for easier usage
  public static async sendRequestStatic<T>(
    endpoint: APIEndpointDetails,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const instance = AxiosService.getInstance();
    return instance.sendRequest<T>(endpoint, options);
  }

  public async makeRequest<T>(
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
      return await this.axiosInstance(config);
    } catch (e) {
      console.error(`Axios Error RESPONSE [${endpoint}]:`, e);
      throw e;
    }
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

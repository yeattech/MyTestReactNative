export const API_BASE_URL = 'http://192.168.45.42:8100/mt-springboot-maven';

export const ENDPOINTS = {
  aesCbc256Decrypt: '/encryption/aes-cbc-256/decrypt',
} as const;

export type AesDecryptRequest = {
  password: string;
  iv: string;
};

export type AesDecryptResponse = {
  success: boolean;
  message?: string;
  decryptedText?: string;
  // add more fields if your backend returns them
};



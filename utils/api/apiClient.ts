import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import * as dotenv from "dotenv";
dotenv.config();

class APIClient {
  private client: AxiosInstance;

  constructor() {
    if (!process.env.RP_BASE_URL) {
      throw new Error("RP_BASE_URL is not defined in .env");
    }
    if (!process.env.RP_TOKEN) {
      throw new Error("RP_TOKEN is not defined in .env");
    }

    this.client = axios.create({
      baseURL: process.env.RP_BASE_URL,
      headers: {
        Authorization: `Bearer ${process.env.RP_TOKEN}`,
        Accept: "application/json",
      },
      proxy: {
        host: String(process.env.MY_HOST),
        port: 8888,
      },
      timeout: 5000,
    });

    this.client.interceptors.request.use((config) => {
      console.log("[API REQUEST]", config.method?.toUpperCase(), config.url);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        console.log("[API RESPONSE]", response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error(
          "[API ERROR]",
          error.response?.status,
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  async get<T>(path: string, params?: any): Promise<T> {
    return this.request<T>({ method: "GET", url: path, params });
  }

  async post<T>(path: string, data?: any): Promise<T> {
    return this.request<T>({ method: "POST", url: path, data });
  }

  async put<T>(path: string, data?: any): Promise<T> {
    return this.request<T>({ method: "PUT", url: path, data });
  }

  async patch<T>(path: string, data?: any): Promise<T> {
    return this.request<T>({ method: "PATCH", url: path, data });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: "DELETE", url: path });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.request<T>(config);
    return response.data;
  }
}

export const apiClient = new APIClient();

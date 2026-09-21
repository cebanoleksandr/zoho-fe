import { apiClient, tokenStorage } from '../client';
import type {
  AuthResponse,
  LoginPayload,
  RefreshTokenPayload,
  RegisterPayload,
} from '../../types';

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async refresh(payload: RefreshTokenPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh', payload);
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    tokenStorage.clearTokens();
  },
};

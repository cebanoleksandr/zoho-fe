export interface ApiKey {
  id: string;
  organizationId: string;
  name: string;
  scopes: string[];
  prefix: string;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface CreateApiKeyPayload {
  name: string;
  scopes?: string[];
}

export interface CreateApiKeyResponse extends ApiKey {
  key: string;
  warning: string;
}

// TODO: Update user type
export interface UserState {
  user: object;
  setUser: (user: object) => void;
}

export type Message = {
  user: {
    name: string;
    isBot?: boolean;
  };
  message: string;
};

// Extract Key from Motoko Variants
export type VariantKeys<T> = T extends any ? keyof T : never;

export type CreateAgentNavTypes = "persona" | "knowledge" | "integrations";

export type IntegrationTypes = "X" | "TELEGRAM";

export type XAgentIntegrationCreate = {
  x_api_key: string;
  x_access_token: string;
  x_api_key_secret: string;
  x_access_token_secret: string;
  x_bearer_token: string;
  user_id: string;
  agent_id: string;
  owner: string;
  prompt: string;
  integration_id: string;
  agent_name: string;
};

export type XAgentIntegrationUpdate = {
  x_api_key: string;
  x_access_token: string;
  x_api_key_secret: string;
  x_access_token_secret: string;
  x_bearer_token: string;
  user_id: string;
  integration_id: string;
};

export type XAgentIntegrationResponse = {
  PK: string;
  SK: string;
  agent_name: string;
  agent_owner: string;
  agent_prompt: string;
  credentials: {
    x_access_token: string;
    x_access_token_secret: string;
    x_api_key: string;
    x_api_key_secret: string;
    x_bearer_token: string;
    user_id: string;
  };
  integration_type: string;
  is_enabled: boolean;
  x_rate_limit_remaining: number;
};

export type TelegramIntegrationCreate = {
  telegram_api_key: string;
  owner: string;
  prompt: string;
  agent_id: string;
  integration_id: string;
  agent_name: string;
};

export type TelegramAgentIntegrationResponse = {
  agent_id: string;
  agent_name: string;
  agent_owner: string;
  agent_prompt: string;
  credentials: {
    telegram_api_key: string;
  };
  integrations?: Array<{
    integration_id: string;
    integration_type: string;
  }>;
  integration_id?: string;
};

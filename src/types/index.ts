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

export type XAgentCredentials = {
  x_api_key: string;
  x_access_token: string;
  x_api_key_secret: string;
  x_access_token_secret: string;
  x_bearer_token: string;
  user_id: string;
};

export type TelegramAgentCredentials = {
  telegram_api_key: string;
};

export type AgentIntegrationData = {
  credentials: XAgentCredentials | TelegramAgentCredentials;
  agent_owner: string;
  agent_name: string;
  agent_prompt: string;
  is_enabled: boolean;
  integration_type: IntegrationTypes;
  integration_id: string;
};

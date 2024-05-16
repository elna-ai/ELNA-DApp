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
export type ExtractKeysFromVariant<T> = T extends { [K in keyof T]: null }
  ? keyof T
  : never;

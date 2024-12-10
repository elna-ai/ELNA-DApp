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
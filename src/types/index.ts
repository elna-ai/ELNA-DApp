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

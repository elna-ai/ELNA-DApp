import create from "zustand";

type AppState = {
  isConnected: boolean;
  principalId?: string | null;
  accountId?: string | null;
  isConnecting: boolean;
  update: (s: Partial<AppState>) => void;
};

export const useAuth = create<AppState>(set => ({
  isConnected: false,
  principalId: null,
  accountId: null,
  isConnecting: false,
  update: newState => {
    set(state => ({ ...state, ...newState }));
  },
}));

export default useAuth;

import { create } from "zustand";

type CreateWizardStore = {
  name: string;
  setWizardName: (name: string) => void;
  resetWizardName: () => void;
};

export const useCreateWizardStore = create<CreateWizardStore>()(set => ({
  name: "",
  setWizardName: (name: string) => set(() => ({ name })),
  resetWizardName: () => set({ name: "" }),
}));

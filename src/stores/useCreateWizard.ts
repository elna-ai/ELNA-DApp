import { create } from "zustand";

type CreateWizardStore = {
  wizardName: string;
  wizardId: string;
  setWizardName: (wizardName: string) => void;
  resetWizardName: () => void;
  setWizardId: (wizardName: string) => void;
  resetWizardId: () => void;
};

export const useCreateWizardStore = create<CreateWizardStore>()(set => ({
  wizardName: "",
  wizardId: "",
  setWizardName: (wizardName: string) => set(() => ({ wizardName })),
  resetWizardName: () => set({ wizardName: "" }),
  setWizardId: (wizardId: string) => set(() => ({ wizardId })),
  resetWizardId: () => set({ wizardId: "" }),
}));

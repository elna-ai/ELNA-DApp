// TODO: Update user type
export interface UserState {
  user: object;
  setUser: (user: object) => void;
}

export enum WizardVisibility {
  public = "public",
  private = "private",
  unlisted = "unlisted",
}

export type WizardVisibilityBackend = {
  publicVisibility?: null;
  privateVisibility?: null;
  unlistedVisibility?: null;
};
export interface WizardDetails {
  id: string;
  name: string;
  avatar?: string;
  biography: string;
  greeting: string;
  summary?: string;
  userId: string;
  visibility: WizardVisibilityBackend;
}

import { AVATAR_IMAGES } from "./constants";

export const getAvatar = (id: string) => AVATAR_IMAGES.find(avatar => avatar.id === id);


import { EUserProfile } from 'src/variables/storage';

export const setItem = (key: string, value: string) => {
  return localStorage.setItem(key, value);
};

export const getItem = (key: string) => {
  return localStorage.getItem(key);
};

export const clearAllItem = () => {
  return localStorage.clear();
};

const channel = new BroadcastChannel('notifications');

export const changeCurrentProfileId = (id: string) => {
  if (!id) return;
  setItem(EUserProfile.PROFILE_ID, id);
  channel.postMessage({ profileId: id });
};

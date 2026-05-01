import { auth } from '@/config/firebase';

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export const getCurrentUserId = () => {
  return getStoredUser()?.id || auth.currentUser?.uid || null;
};

const WHATS_NEW_STORAGE_KEY = 'whats_new_shown';

export const isWhatsNewShown = () => {
  return localStorage.getItem(WHATS_NEW_STORAGE_KEY) === 'true';
};

export const markWhatsNewAsShown = () => {
  localStorage.setItem(WHATS_NEW_STORAGE_KEY, 'true');
};

export const resetWhatsNewShown = () => {
  localStorage.removeItem(WHATS_NEW_STORAGE_KEY);
}; 
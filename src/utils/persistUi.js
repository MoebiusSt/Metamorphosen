const UI_STORAGE_KEY = 'metamorphosen_ui';

export function getPersistedUi() {
  try {
    const raw = localStorage.getItem(UI_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setPersistedUi(partial) {
  try {
    const current = getPersistedUi();
    const next = { ...current, ...partial };
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(next));
  } catch (_) {}
}

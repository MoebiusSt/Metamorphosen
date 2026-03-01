import { useState, useCallback } from 'react';

const AUTH_KEY = 'metamorphosen_auth';
// SHA-256 of "Sepp"
const PASSWORD_HASH = 'a4ed6c71bc5001751c3f213bd6fd0a91289d2e6fea604c103254fbbd4b68b4b0';

async function sha256(message) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function useEditMode() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_KEY) === 'true'
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const toggleEditMode = useCallback(() => {
    if (isEditMode) {
      setIsEditMode(false);
      return;
    }
    if (isAuthenticated) {
      setIsEditMode(true);
    } else {
      setShowPasswordModal(true);
    }
  }, [isEditMode, isAuthenticated]);

  const authenticate = useCallback(async (password) => {
    const hash = await sha256(password);
    if (hash === PASSWORD_HASH) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setIsEditMode(true);
      return true;
    }
    return false;
  }, []);

  const closePasswordModal = useCallback(() => {
    setShowPasswordModal(false);
  }, []);

  return { isEditMode, showPasswordModal, toggleEditMode, authenticate, closePasswordModal };
}

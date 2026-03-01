import { useState, useRef, useEffect } from 'react';

export default function EditPasswordModal({ onAuthenticate, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsChecking(true);
    setError(false);
    const ok = await onAuthenticate(password);
    if (!ok) {
      setError(true);
      setPassword('');
      setIsChecking(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <h3 className="modal__title">Edit-Modus</h3>
        <p className="modal__desc">Passwort eingeben um fortzufahren.</p>
        <form className="modal__form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={`modal__input${error ? ' modal__input--error' : ''}`}
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            placeholder="Passwort"
            autoComplete="current-password"
          />
          {error && <p className="modal__error">Falsches Passwort.</p>}
          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--cancel" onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit" className="modal__btn modal__btn--confirm" disabled={!password || isChecking}>
              {isChecking ? '…' : 'OK'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

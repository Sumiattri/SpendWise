import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export default function Dialog({ title, description, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="dialog-content">
        <div className="dialog-heading">
          <span className="dialog-symbol">
            <Icon name="wallet" size={22} />
          </span>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <Icon name="close" size={19} />
          </button>
        </div>
        <h2 id="dialog-title">{title}</h2>
        <p id="dialog-description">{description}</p>
        {children}
      </div>
    </dialog>
  );
}

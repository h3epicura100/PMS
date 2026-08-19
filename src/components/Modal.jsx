import React from 'react';

const Modal = ({ isOpen, onClose, title, children, width = '560px' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--color-border-light)',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text-deep)', letterSpacing: '-0.01em' }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                background: 'var(--color-primary-subtle)',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                fontSize: '1rem',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-primary-subtle)'; }}
            >
              ✕
            </button>
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

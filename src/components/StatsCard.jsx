import React from 'react';

const colorMap = {
  primary:  { bg: '#f5f3ff', border: '#e9e2ff', iconBg: '#ede9fe', text: '#7c3aed' },
  emerald:  { bg: '#ecfdf5', border: '#d1fae5', iconBg: '#d1fae5', text: '#10b981' },
  amber:    { bg: '#fff7ed', border: '#ffedd5', iconBg: '#ffedd5', text: '#f59e0b' },
  rose:     { bg: '#fef2f2', border: '#fee2e2', iconBg: '#fee2e2', text: '#ef4444' },
  sky:      { bg: '#f0f9ff', border: '#e0f2fe', iconBg: '#e0f2fe', text: '#0ea5e9' },
};

const StatsCard = ({ label, value, icon, color = 'primary', subtitle }) => {
  const c = colorMap[color] || colorMap.primary;

  return (
    <div
      className="glass-card"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        padding: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: c.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-text-deep)', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.72rem', color: c.text, marginTop: '4px', fontWeight: '600' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;

import React from 'react';

const ProgressBar = ({ percent = 0, height = 8, showLabel = true, color }) => {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  const gradientMap = {
    emerald: 'linear-gradient(90deg, #10b981, #34d399)',
    amber: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
    rose: 'linear-gradient(90deg, #f43f5e, #fb7185)',
    primary: 'linear-gradient(90deg, #7c3aed, #d946ef)',
  };

  // Auto-select color based on percent
  const autoColor = clampedPercent >= 75 ? 'emerald' : clampedPercent >= 40 ? 'amber' : 'primary';
  const gradient = gradientMap[color || autoColor];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
      <div className="progress-track" style={{ height: `${height}px`, flex: 1, background: '#f5f3ff' }}>
        <div
          className="progress-fill"
          style={{
            width: `${clampedPercent}%`,
            background: gradient,
            height: '100%',
            borderRadius: '999px',
            boxShadow: '0 1px 3px rgba(124, 58, 237, 0.1)',
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-primary)', minWidth: '36px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
          {clampedPercent}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;

import React from 'react';
import { STATUS, EVENT_STATUS } from '../lib/constants';

const statusConfig = {
  // Task statuses
  [STATUS.NOT_STARTED]:  { className: 'badge-not-started',  dot: '○' },
  [STATUS.IN_PROGRESS]:  { className: 'badge-in-progress',  dot: '◉' },
  [STATUS.COMPLETED]:    { className: 'badge-completed',    dot: '✓' },
  [STATUS.DELAYED]:      { className: 'badge-delayed',      dot: '!' },
  // Event statuses
  [EVENT_STATUS.PLANNED]:   { className: 'badge-planned',   dot: '○' },
  [EVENT_STATUS.ONGOING]:   { className: 'badge-ongoing',   dot: '◉' },
  [EVENT_STATUS.COMPLETED]: { className: 'badge-completed', dot: '✓' },
  [EVENT_STATUS.CANCELLED]: { className: 'badge-cancelled', dot: '✕' },
};

const StatusBadge = ({ status, size = 'default' }) => {
  const config = statusConfig[status] || { className: 'badge-not-started', dot: '?' };
  return (
    <span
      className={`badge ${config.className}`}
      style={size === 'sm' ? { fontSize: '0.65rem', padding: '2px 8px' } : {}}
    >
      <span>{config.dot}</span>
      {status}
    </span>
  );
};

export default StatusBadge;

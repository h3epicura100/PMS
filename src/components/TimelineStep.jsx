import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { STATUS, formatTime } from '../lib/constants';

const TimelineStep = ({ task, onStatusChange, onRemarksChange, isLocked = false }) => {
  const [showRemarks, setShowRemarks] = useState(false);

  const getNextStatus = (current) => {
    if (current === STATUS.NOT_STARTED) return STATUS.IN_PROGRESS;
    if (current === STATUS.IN_PROGRESS) return STATUS.COMPLETED;
    if (current === STATUS.DELAYED) return STATUS.COMPLETED;
    return current;
  };

  const dotClass =
    task.status === STATUS.COMPLETED ? 'completed' :
    task.status === STATUS.IN_PROGRESS ? 'in-progress' :
    task.status === STATUS.DELAYED ? 'delayed' : '';

  const handleClick = () => {
    if (isLocked || task.status === STATUS.COMPLETED) return;
    const next = getNextStatus(task.status);
    onStatusChange(task.taskId, next);
  };

  const statusBg =
    isLocked ? '#f8fafc' :
    task.status === STATUS.DELAYED ? '#fef2f2' :
    task.status === STATUS.COMPLETED ? '#ecfdf5' :
    '#ffffff';

  const statusBorder =
    task.status === STATUS.DELAYED ? '#fee2e2' :
    task.status === STATUS.COMPLETED ? '#d1fae5' :
    task.status === STATUS.IN_PROGRESS ? 'var(--color-primary-light)' :
    'var(--color-border-light)';

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        position: 'relative',
        paddingLeft: '8px',
      }}
      className="animate-fade-in"
    >
      {/* Timeline Line/Connector handled by parent container */}
      
      {/* Timeline Dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '6px' }}>
        <div className={`timeline-dot ${dotClass}`} />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          background: statusBg,
          border: `1px solid ${statusBorder}`,
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '16px',
          opacity: isLocked ? 0.6 : 1,
          cursor: isLocked || task.status === STATUS.COMPLETED ? 'default' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: task.status === STATUS.IN_PROGRESS ? '0 10px 15px -3px rgba(124, 58, 237, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
        onClick={handleClick}
        className={!isLocked && task.status !== STATUS.COMPLETED ? 'hover-scale' : ''}
      >
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: '900',
              color: 'var(--color-primary)',
              background: 'var(--color-primary-subtle)',
              padding: '4px 10px',
              borderRadius: '6px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              STEP {task.step}
            </span>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-text-deep)' }}>
              {task.name}
            </span>
          </div>
          <StatusBadge status={task.status} size="sm" />
        </div>

        {/* Details Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '16px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--color-border-light)',
        }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: '900', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Owner</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: '700', marginTop: '2px' }}>{task.owner}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '9px', fontWeight: '900', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Planned time</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: '600', marginTop: '2px' }}>{formatTime(task.plannedTime)}</div>
          </div>

          {task.actualTime && (
            <div>
              <div style={{ fontSize: '9px', fontWeight: '900', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actual time</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: '700', marginTop: '2px' }}>{formatTime(task.actualTime)}</div>
            </div>
          )}

          {task.delay > 0 && (
            <div>
              <div style={{ fontSize: '9px', fontWeight: '900', color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delay</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-danger)', fontWeight: '800', marginTop: '2px' }}>+{task.delay} min</div>
            </div>
          )}
        </div>

        {/* Remarks */}
        {(showRemarks || task.remarks) && (
          <div style={{ marginTop: '16px' }}>
            <input
              type="text"
              placeholder="Add execution remarks..."
              value={task.remarks || ''}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onRemarksChange(task.taskId, e.target.value)}
              className="form-input"
              style={{ fontSize: '0.85rem', height: '40px', background: '#f8fafc' }}
            />
          </div>
        )}

        {/* Action / Lock Indicators */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          {!showRemarks && !task.remarks && !isLocked && task.status !== STATUS.COMPLETED && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowRemarks(true); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>+</span> Add remarks
            </button>
          )}

          {isLocked && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🔒</span> STEP LOCKED — COMPLETE PREVIOUS STEPS
            </div>
          )}
          
          {!isLocked && task.status !== STATUS.COMPLETED && (
             <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '700', opacity: 0.6 }}>
               Click to update status →
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineStep;

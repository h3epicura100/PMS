import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../lib/constants';

const IconMap = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  booking: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  booked: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  vendor: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  chef: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 13.87A4 4 0 0 1 7.41 6.51 4 4 0 0 1 16.59 6.51 4 4 0 0 1 18 13.87V21H6Z" /><line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  ),
  tag: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  vendor_update: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 19l3-3-3-3" /><path d="M25 16H19" />
    </svg>
  ),
  material: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  ),
  crockery: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  ),
  decor: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  truck: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polyline points="16 8 20 8 23 11 23 16 16 16" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
};

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();

  // Role-based filtering logic
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (!user) return false;
    if (user.role?.toLowerCase() === 'admin') return true;

    // Check if item permission key exists in the user's role string (comma-separated or just string)
    const permissions = user.role?.toLowerCase().split(',').map(p => p.trim()) || [];
    return permissions.includes(item.permission?.toLowerCase());
  });

  return (
    <aside
      style={{
        width: '240px',
        height: '100vh',
        background: '#ffffff',
        borderRight: '1px solid var(--color-border-light)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        overflow: 'hidden',
        boxShadow: '4px 0 24px rgba(124, 58, 237, 0.03)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 20px',
          borderBottom: '1px solid var(--color-border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '72px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary), #d946ef)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            fontWeight: '900',
            color: 'white',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)',
          }}
        >
          E
        </div>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-text-deep)', letterSpacing: '0.05em' }}>PMS</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>Performance Management System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '24px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: isActive
                  ? 'var(--color-primary-subtle)'
                  : 'transparent',
                border: isActive ? '1px solid var(--color-primary-light)' : '1px solid transparent',
                transition: 'all 0.3s ease',
                fontSize: '0.85rem',
                fontWeight: isActive ? '700' : '500',
                justifyContent: 'flex-start',
                position: 'relative'
              }}
            >
              <span style={{
                flexShrink: 0,
                display: 'flex',
                transition: 'transform 0.3s ease',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}>
                {IconMap[item.icon]}
              </span>
              <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)'
                }} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--color-border-light)', background: '#fdfaff', margin: 'auto 12px 12px 12px', borderRadius: '16px', border: '1px solid var(--color-border-light)' }}>
        <div style={{ marginBottom: '16px', padding: '0 8px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text-deep)' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role || 'Guest'}</div>
        </div>

        <button
          onClick={onLogout}
          className="btn-logout"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #fee2e2',
            background: '#fef2f2',
            color: '#ef4444',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
            fontSize: '0.85rem',
            fontWeight: '700',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ef4444';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fef2f2';
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.05)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

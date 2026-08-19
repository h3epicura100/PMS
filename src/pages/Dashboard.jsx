import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import { getDashboardStats, getEvents, getEventProgress, getTodaysTasks, getDelayedTasks } from '../lib/dataService';
import { formatDate, STATUS } from '../lib/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [delayedTasks, setDelayedTasks] = useState([]);

  useEffect(() => {
    setStats(getDashboardStats());
    setEvents(getEvents());
    setTodayTasks(getTodaysTasks());
    setDelayedTasks(getDelayedTasks());

    const interval = setInterval(() => {
      setStats(getDashboardStats());
      setTodayTasks(getTodaysTasks());
      setDelayedTasks(getDelayedTasks());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  // Task status distribution for chart
  const taskDist = [
    { label: 'Completed', value: stats.completedTasksCount, color: 'var(--color-success)' },
    { label: 'In Progress', value: stats.inProgressTasks, color: 'var(--color-primary)' },
    { label: 'Delayed', value: stats.delayedTasksCount, color: 'var(--color-danger)' },
    { label: 'Pending', value: stats.pendingTasks, color: 'var(--color-text-muted)' },
  ];
  const totalForChart = taskDist.reduce((s, d) => s + d.value, 0) || 1;

  // Recent events (last 5)
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="page-container animate-entry">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Real-time overview of all event operations</p>
      </div>

      {/* KPI Cards */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatsCard icon="📅" label="Total Events" value={stats.totalEvents} color="primary" />
        <StatsCard icon="🔥" label="Today's Events" value={stats.todayEvents} color="amber" subtitle={stats.todayEvents > 0 ? 'Active today' : 'None today'} />
        <StatsCard icon="📈" label="Upcoming" value={stats.upcomingEvents} color="sky" />
        <StatsCard icon="✅" label="Completed" value={stats.completedEvents} color="emerald" />
        <StatsCard icon="⏱" label="On-Time %" value={`${stats.onTimePercent}%`} color={stats.onTimePercent >= 80 ? 'emerald' : 'amber'} />
        <StatsCard icon="⚠️" label="Avg Delay" value={stats.avgDelay > 0 ? `${stats.avgDelay} min` : '0 min'} color={stats.avgDelay > 0 ? 'rose' : 'emerald'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Task Distribution */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: '800', marginBottom: '24px', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            📊 Task Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {taskDist.map((d) => (
              <div key={d.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: d.color, display: 'inline-block' }} />
                    {d.label}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: d.color }}>{d.value}</span>
                </div>
                <div className="progress-track" style={{ height: '6px' }}>
                  <div style={{
                    height: '100%',
                    width: `${(d.value / totalForChart) * 100}%`,
                    background: d.color,
                    borderRadius: '999px',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--color-primary-subtle)', borderRadius: '12px', textAlign: 'center', border: '1px dashed var(--color-primary-light)' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--color-primary)' }}>{stats.totalTasks}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginLeft: '10px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>Total Tasks</span>
          </div>
        </div>

        {/* Delayed Tasks Alert */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: '800', marginBottom: '16px', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            🚨 Delayed Tasks
            {delayedTasks.length > 0 && (
              <span style={{ background: 'var(--color-danger)', color: 'white', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '800' }}>
                {delayedTasks.length}
              </span>
            )}
          </h3>
          {delayedTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-success)' }}>Everything is on schedule!</div>
              <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>No delayed tasks detected.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
              {delayedTasks.slice(0, 8).map((task, i) => (
                <div
                  key={i}
                  className="hover-scale"
                  style={{
                    padding: '12px 16px',
                    background: 'var(--color-primary-subtle)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/bookings`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: '800' }}>{task.eventId}</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>{task.name}</span>
                  </div>
                  <span style={{ color: 'var(--color-danger)', fontWeight: '800', background: '#fef2f2', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    +{task.delay} min
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Events */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>📋 Recent Events</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/bookings')}>View All Bookings →</button>
        </div>
        {recentEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🗓</div>
            <div style={{ fontSize: '0.9rem', marginBottom: '12px' }}>No events yet</div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/bookings')}>
              + Create First Booking
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentEvents.map((event) => {
              const progress = getEventProgress(event.orderId);
              return (
                <div
                  key={event.orderId}
                  className="hover-scale"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    background: 'var(--color-surface)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid var(--color-border-light)',
                  }}
                  onClick={() => navigate(`/bookings`)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary-light)'; e.currentTarget.style.background = 'var(--color-primary-subtle)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-light)'; e.currentTarget.style.background = 'var(--color-surface)'; }}
                >
                  <span style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '0.8rem', minWidth: '80px' }}>{event.orderId}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>{event.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{event.functionType}</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: '600', minWidth: '100px' }}>{formatDate(event.eventDate)}</span>
                  <div style={{ minWidth: '140px' }}>
                    <ProgressBar percent={progress} height={6} showLabel={true} />
                  </div>
                  <div style={{ minWidth: '110px', display: 'flex', justifyContent: 'flex-end' }}>
                    <StatusBadge status={event.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

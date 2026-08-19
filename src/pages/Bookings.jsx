import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useToast } from '../components/Toast';
import { createEvent, getEventsFromSheet } from '../lib/dataService';
import { FUNCTION_TYPES, formatDisplayDate } from '../lib/constants';

const Bookings = () => {
  const toast = useToast();
  
  // Page State
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    functionType: '',
    eventDate: '',
    venue: '',
    guests: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await getEventsFromSheet();
    setBookings(data);
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Customer name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.trim())) errs.phone = 'Enter valid 10-digit number';
    if (!formData.functionType) errs.functionType = 'Select function type';
    if (!formData.eventDate) errs.eventDate = 'Event date is required';
    if (!formData.venue.trim()) errs.venue = 'Venue is required';
    if (!formData.guests || parseInt(formData.guests) <= 0) errs.guests = 'Enter valid guest count';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the highlighted errors');
      return;
    }

    setIsSubmitting(true);
    try {
      const event = await createEvent(formData);
      toast.success(`Booking ${event.orderId} created successfully!`);
      setIsDialogOpen(false);
      setFormData({
        customerName: '',
        phone: '',
        functionType: '',
        eventDate: '',
        venue: '',
        guests: '',
      });
      // Refresh the list instead of redirecting
      loadBookings();
    } catch (err) {
      toast.error('Failed to create event. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label, field, type = 'text', placeholder = '', options = {}) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label className="form-label">{label}</label>
      {type === 'select' ? (
        <select
          className="form-select"
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
        >
          <option value="">Select {label}</option>
          {(options.items || []).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="form-input"
          placeholder={placeholder}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      )}
      {errors[field] && (
        <span style={{ fontSize: '0.72rem', color: 'var(--color-danger)', marginTop: '4px', fontWeight: '600' }}>{errors[field]}</span>
      )}
    </div>
  );

  return (
    <div className="page-container animate-entry">
      {/* Header Card */}
      <div className="glass-card" style={{ 
        padding: '12px 24px', 
        marginBottom: '24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        border: '1px solid var(--color-border-light)',
        boxShadow: '0 8px 32px rgba(124, 58, 237, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--color-primary-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-text-deep)', marginBottom: '2px' }}>Bookings</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>Manage all event bookings and records</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="btn btn-primary" 
          style={{ 
            padding: '12px 24px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: '800'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span> Add Booking
        </button>
      </div>

      {/* Main Content Area */}
      <div className="glass-card" style={{ 
        padding: '20px', 
        border: '1px solid var(--color-border-light)',
        minHeight: '400px'
      }}>
        {/* Table Filters/Stats */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '28px',
          padding: '0 4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span style={{ 
               backgroundColor: 'var(--color-primary-subtle)', 
               color: 'var(--color-primary)',
               padding: '6px 14px',
               borderRadius: '100px',
               fontSize: '0.75rem',
               fontWeight: '900',
               letterSpacing: '0.02em',
               border: '1px solid var(--color-primary-light)'
             }}>
               {loading ? 'CALCULATING...' : `ALL BOOKINGS (${bookings.length})`}
             </span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              backgroundColor: 'var(--color-surface)', 
              border: '1px solid var(--color-border-light)',
              padding: '10px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '240px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="var(--color-text-muted)">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                type="text" 
                placeholder="Search bookings..." 
                style={{ 
                  border: 'none', 
                  outline: 'none', 
                  background: 'transparent', 
                  width: '100%', 
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }} 
              />
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-border-light)' }}>
                {['DATE', 'ORDER NO.', 'CUSTOMER', 'PHONE', 'TYPE', 'EVENT DATE', 'VENUE', 'GUESTS'].map((h) => (
                  <th key={h} style={{ 
                    padding: '16px 20px', 
                    fontSize: '11px', 
                    fontWeight: '900', 
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <div className="loading-spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--color-primary-subtle)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%' }}></div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '700' }}>Fetching from Google Sheets...</span>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                    No records found in sheet.
                  </td>
                </tr>
              ) : (
                bookings.map((row, idx) => (
                  <tr key={idx} style={{ 
                    borderBottom: '1px solid var(--color-border-light)',
                    transition: 'background 0.2s ease',
                  }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--color-text-deep)', fontWeight: '600' }}>
                      {row.timestamp ? formatDisplayDate(row.timestamp) : '—'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        backgroundColor: 'var(--color-primary-subtle)', 
                        color: 'var(--color-primary)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '800'
                      }}>{row.orderNo || 'PENDING'}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--color-text-deep)', fontWeight: '700' }}>{row.customerName}</td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>{row.phone}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        backgroundColor: 'var(--color-surface-soft)', 
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--color-text-muted)',
                        border: '1px solid var(--color-border-light)'
                      }}>{row.functionType}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--color-text-deep)', fontWeight: '600' }}>
                      {row.eventDate ? formatDisplayDate(row.eventDate) : '—'}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>{row.venue}</td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--color-text-deep)', fontWeight: '800' }}>{row.guests}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Dialog Modal */}
      {isDialogOpen && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className="glass-card" style={{ 
            width: '100%', 
            maxWidth: '650px', 
            padding: '32px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)',
            border: '1px solid var(--color-primary-light)',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setIsDialogOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--color-surface-soft)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--color-primary), #d946ef)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: 'white',
                boxShadow: '0 6px 15px rgba(124, 58, 237, 0.3)',
              }}>⚡</div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--color-text-deep)' }}>Create New Booking</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600', marginTop: '2px' }}>Enter customer and event details below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '18px',
                marginBottom: '28px'
              }}>
                <div style={{ gridColumn: 'span 2' }}>
                   {renderField('Customer Name', 'customerName', 'text', 'Enter full name')}
                </div>
                {renderField('Phone Number', 'phone', 'tel', '10-digit number')}
                {renderField('Function Type', 'functionType', 'select', '', { items: FUNCTION_TYPES })}
                {renderField('Event Date', 'eventDate', 'date')}
                {renderField('Venue', 'venue', 'text', 'Enter location')}
                <div style={{ gridColumn: 'span 2' }}>
                   {renderField('Number of People', 'guests', 'number', 'Expected guest count')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => setIsDialogOpen(false)} 
                  style={{ padding: '10px 24px', fontSize: '0.9rem', fontWeight: '700' }}
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ 
                    padding: '10px 32px', 
                    fontSize: '0.95rem',
                    boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)',
                    fontWeight: '800'
                  }} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '🚀 Submitting...' : '🚀 Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Internal Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .loading-spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Bookings;

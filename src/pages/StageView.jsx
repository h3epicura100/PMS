import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useToast } from '../components/Toast';
import { formatDisplayDate } from '../lib/constants';
import { getRawSheetData, uploadFileToDrive, updateSheetRow } from '../lib/dataService';



// Column definitions for the stage table
// Each entry: { label, index } where index is the 0-based array column
const STAGE_COLUMNS = [
  { label: 'DATE',       index: 0 },
  { label: 'ORDER NO.',  index: 1 },
  { label: 'CUSTOMER',   index: 2 },
  { label: 'PHONE',      index: 3 },
  { label: 'TYPE',       index: 4 },
  { label: 'PLANNED',    index: 8 },   // Col I
  { label: 'EVENT DATE', index: 5 },
  { label: 'VENUE',      index: 6 },
  { label: 'GUESTS',     index: 7 },
];

const StageView = ({ title, stageId, mapping }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [processData, setProcessData] = useState({ status: '', attachment: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [stageId]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getRawSheetData('ORDER');
      // Skip row 0 (header) + rows 1-5 (metadata) = slice(5) since fetchPaginated starts from row 2
      setRecords(data.slice(5));
    } catch (error) {
      console.error('Failed to load records:', error);
      toast.error('Failed to fetch data from sheet');
    }
    setLoading(false);
  };

  // Only show rows that have a valid ORDER NO (col 1)
  const allValidRecords = records.filter(row => row[1] && String(row[1]).startsWith('DO-'));

  const pendingRecords = allValidRecords.filter(row => {
    const planned = row[mapping?.planned];
    const actual  = row[mapping?.actual];
    return planned && (!actual || actual === '');
  });

  const historyRecords = allValidRecords.filter(row => {
    const planned = row[mapping?.planned];
    const actual  = row[mapping?.actual];
    return planned && actual && actual !== '';
  });

  const handleProcessClick = (row) => {
    setSelectedRow(row);
    setProcessData({ status: '', attachment: null });
    setIsDialogOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid format! Please upload PDF, JPEG, or PNG.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large! Max size is 5MB.');
      e.target.value = '';
      return;
    }
    setProcessData(prev => ({ ...prev, attachment: file }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!processData.status) {
      toast.error('Please select a status');
      return;
    }

    setIsSubmitting(true);
    try {
      let fileUrl = '';
      if (processData.attachment && mapping?.file !== null) {
        toast.info('Uploading attachment...');
        fileUrl = await uploadFileToDrive(processData.attachment);
        if (!fileUrl) throw new Error('File upload failed. Check your GAS permissions.');
      }

      const orderNo = selectedRow[1];

      // Build clean local timestamp: DD/MM/YYYY HH:MM:SS
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const actualTimestamp = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      // Build targeted update object { colIndex: value } 
      // GAS columns are 1-indexed, so we add 1 to mapping indices
      const updates = {
        [mapping.actual + 1]: actualTimestamp, // Col J: Actual
        [mapping.status + 1]: processData.status // Col L: Status
      };
      
      if (mapping.file !== null && fileUrl) {
        updates[mapping.file + 1] = fileUrl; // Col M: Drive link
      }

      // Send the targeted object to the new polymorphic backend action
      // We pass orderNo (selectedRow[1]) so the backend finds the right row
      const success = await updateSheetRow('ORDER', updates, orderNo);

      if (success) {
        toast.success('Stage updated successfully!');
        setIsDialogOpen(false);
        loadRecords();
      } else {
        throw new Error('Sheet update failed. Please try again.');
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error.message || 'Failed to update record');
    }
    setIsSubmitting(false);
  };

  const displayRecords = activeTab === 'pending' ? pendingRecords : historyRecords;

  const renderCellValue = (row, col) => {
    const val = row[col.index];
    if (!val && val !== 0) return '—';
    if (col.label === 'PLANNED' || col.label === 'DATE' || col.label === 'EVENT DATE' || col.label === 'ACTUAL') {
      return formatDisplayDate(val);
    }
    return String(val);
  };

  // Columns shown in History mode also include ACTUAL
  const visibleColumns = activeTab === 'history'
    ? [...STAGE_COLUMNS, { label: 'ACTUAL', index: mapping?.actual }]
    : STAGE_COLUMNS;

  return (
    <div className="page-container animate-entry">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">Track and process event workflow for {title}</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '28px',
        backgroundColor: 'var(--color-surface-soft)',
        padding: '6px',
        borderRadius: '16px',
        width: 'fit-content',
        border: '1px solid var(--color-border-light)'
      }}>
        {['pending', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
              boxShadow: activeTab === tab ? '0 4px 12px rgba(124, 58, 237, 0.1)' : 'none',
            }}
          >
            {tab}
            <span style={{
              marginLeft: '8px',
              fontSize: '0.7rem',
              opacity: 0.6,
              background: activeTab === tab ? 'var(--color-primary-subtle)' : 'var(--color-border-light)',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {tab === 'pending' ? pendingRecords.length : historyRecords.length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-border-light)' }}>
                {activeTab !== 'history' && (
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '900', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ACTIONS</th>
                )}
                {visibleColumns.map(col => (
                  <th key={col.label} style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '900', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{col.label}</th>
                ))}
                {activeTab !== 'history' && (
                  <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: '900', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>STATUS</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={visibleColumns.length + (activeTab === 'history' ? 0 : 2)} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading live data...</td></tr>
              ) : displayRecords.length === 0 ? (
                <tr><td colSpan={visibleColumns.length + (activeTab === 'history' ? 0 : 2)} style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: '600' }}>No {activeTab} records in this stage.</td></tr>
              ) : (
                displayRecords.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }}>
                    {activeTab !== 'history' && (
                      <td style={{ padding: '14px 20px' }}>
                        {activeTab === 'pending' ? (
                          <button className="btn btn-primary btn-sm" onClick={() => handleProcessClick(row)} style={{ padding: '6px 16px', fontSize: '0.75rem', fontWeight: '800' }}>PROCESS</button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-success)' }}>✅ DONE</span>
                            {mapping?.file && row[mapping.file] && (<a href={row[mapping.file]} target="_blank" rel="noreferrer" title="View Attachment" style={{ textDecoration: 'none', fontSize: '1rem' }}>📎</a>)}
                          </div>
                        )}
                      </td>
                    )}
                    {visibleColumns.map(col => (
                      <td key={col.label} style={{ padding: '14px 20px', fontSize: '13px', color: col.label === 'ORDER NO.' ? 'var(--color-primary)' : 'var(--color-text-deep)', fontWeight: col.label === 'ORDER NO.' ? '800' : '600', whiteSpace: 'nowrap' }}>
                        {col.label === 'ORDER NO.' ? (
                          <span style={{ backgroundColor: 'var(--color-primary-subtle)', padding: '3px 10px', borderRadius: '6px', fontSize: '12px' }}>{row[col.index]}</span>
                        ) : renderCellValue(row, col)}
                      </td>
                    ))}
                    {activeTab !== 'history' && (
                      <td style={{ padding: '14px 20px' }}><span className={`status-pill ${row[mapping?.status] === 'Yes' ? 'status-pill-success' : 'status-pill-muted'}`}>{row[mapping?.status] || '—'}</span></td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Dialog */}
      {isDialogOpen && ReactDOM.createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px'
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '460px', padding: '32px',
            border: '1px solid var(--color-primary-light)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--color-text-deep)', marginBottom: '6px' }}>Process {title}</h2>
            <p style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)', marginBottom: '24px', fontWeight: '600' }}>
              Updating record: <strong style={{ color: 'var(--color-primary)' }}>{selectedRow?.[1]}</strong> — {selectedRow?.[2]}
            </p>

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={processData.status}
                  onChange={(e) => setProcessData(prev => ({ ...prev, status: e.target.value }))}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {mapping?.file !== null && (
                <div style={{ marginBottom: '28px' }}>
                  <label className="form-label">Attachment <span style={{ fontWeight: '500', opacity: 0.6 }}>(PDF / JPEG / PNG)</span></label>
                  <input
                    type="file"
                    className="form-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ padding: '8px' }}
                  />
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '6px', fontWeight: '600' }}>Max size: 5MB</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Syncing to Sheet...' : 'Submit Update'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StageView;

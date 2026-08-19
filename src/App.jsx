import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import StageView from './pages/StageView';
import Login from './pages/Login';
import { startDelayEngine, stopDelayEngine } from './lib/delayEngine';

const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pms_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    startDelayEngine(60000); // Check for delays every 60 seconds
    return () => stopDelayEngine();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('pms_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pms_user');
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
          
          <Route path="/*" element={
            <ProtectedRoute>
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar
                  user={user}
                  onLogout={handleLogout}
                />
                <main
                  style={{
                    flex: 1,
                    paddingLeft: '240px',
                    minHeight: '100vh',
                    background: 'var(--color-surface)',
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/menu-finalize" element={<StageView title="Menu Finalize" stageId="MENU_FINALIZE" mapping={{ planned: 8, actual: 9, status: 11, file: 12 }} />} />
                    <Route path="/vendor-finalize" element={<StageView title="Vendor Finalize" stageId="VENDOR_FINALIZE" mapping={{ planned: 13, actual: 14, status: 16, file: 17 }} />} />
                    <Route path="/inform-chef" element={<StageView title="Inform to Chef" stageId="INFORM_CHEF" mapping={{ planned: 18, actual: 19, status: 21, file: null }} />} />
                    <Route path="/tag-prints" element={<StageView title="Tag Prints" stageId="TAG_PRINTS" mapping={{ planned: 22, actual: 23, status: 25, file: null }} />} />
                    <Route path="/outsource-vendor" element={<StageView title="Outsource Vendor" stageId="OUTSOURCE_VENDOR" mapping={{ planned: 26, actual: 27, status: 29, file: null }} />} />
                    <Route path="/material-arrangement" element={<StageView title="Material Arrangement" stageId="MATERIAL_ARRANGEMENT" mapping={{ planned: 30, actual: 31, status: 33, file: null }} />} />
                    <Route path="/crockery-list" element={<StageView title="Crockery List" stageId="CROCKERY_LIST" mapping={{ planned: 34, actual: 35, status: 37, file: null }} />} />
                    <Route path="/decor-list" element={<StageView title="Decor List" stageId="DECOR_LIST" mapping={{ planned: 38, actual: 39, status: 41, file: null }} />} />
                    <Route path="/final-outsource" element={<StageView title="Final Outsource" stageId="FINAL_OUTSOURCE" mapping={{ planned: 42, actual: 43, status: 45, file: null }} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;

import React, { useState } from 'react';
import { getRawSheetData } from '../lib/dataService';
import { useToast } from '../components/Toast';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Fetch user data from the 'Login' sheet
      const data = await getRawSheetData('Login');
      
      if (data && data.length > 0) {
        // Find matching user
        // Columns: A:S.No, B:Name, C:Username, D:Password, E:Role
        // Indices: 0, 1, 2, 3, 4
        const userRow = data.find(row => 
          row[2] && String(row[2]).toLowerCase() === username.toLowerCase() && 
          row[3] && String(row[3]) === password
        );

        if (userRow) {
          const userData = {
            username: userRow[2],
            name: userRow[1],
            role: userRow[4] || 'user',
          };
          onLogin(userData);
          toast.success(`Welcome back, ${userData.name}!`);
        } else {
          toast.error('Invalid username or password');
        }
      } else {
        toast.error('Authentication service unavailable');
      }
    } catch (err) {
      console.error('Login Error:', err);
      toast.error('Connectivity issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top left, #f5f3ff 0%, #ede9fe 100%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '300px',
        height: '300px',
        background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <div className="glass-card animate-entry" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '48px 40px',
        zIndex: 10,
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 40px rgba(124, 58, 237, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, var(--color-primary), #d946ef)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 16px rgba(124, 58, 237, 0.25)',
            fontSize: '1.8rem',
            fontWeight: '900',
            color: 'white'
          }}>
            E
          </div>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '800', 
            color: 'var(--color-text-deep)',
            letterSpacing: '-0.02em',
            marginBottom: '8px'
          }}>
            Welcome Back
          </h1>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: '0.9rem',
            fontWeight: '500' 
          }}>
            Enter your credentials to access the portal
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ height: '48px', fontSize: '1rem' }}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ height: '48px', fontSize: '1rem' }}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              height: '48px',
              marginTop: '12px',
              width: '100%',
              fontSize: '1rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                  <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.8443 2.50338 15.5714 3.38887 17.0503" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Authenticating...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          marginTop: '32px', 
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          fontWeight: '600'
        }}>
          &copy; 2026 CMS &bull; System v2.4.0
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;

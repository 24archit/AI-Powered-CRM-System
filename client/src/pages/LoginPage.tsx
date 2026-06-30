import { useState } from 'react';
import { TextField, Button, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const EXPRESS_URL = 'http://localhost:2424';

const features = [
  { icon: '🤖', title: 'AI-Powered Triage', desc: 'Autonomous ticket categorization & sentiment analysis' },
  { icon: '🛡️', title: 'Fraud Detection', desc: 'Real-time risk scoring on every customer interaction' },
  { icon: '⚡', title: 'Instant Resolutions', desc: 'RAG-powered response drafts ready in seconds' },
];

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent, isDemo?: 'Admin' | 'User') => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const loginPhone = isDemo === 'Admin' ? '0000000000' : isDemo === 'User' ? '1111111111' : phone;
    const loginPassword = isDemo === 'Admin' ? 'AdminPassword123' : isDemo === 'User' ? 'UserPassword123' : password;

    try {
      const res = await axios.post(`${EXPRESS_URL}/api/auth/login`, { phone: loginPhone, password: loginPassword });
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'Admin') navigate('/admin');
      else navigate('/portal');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crm-login-page">
      {/* Background blobs */}
      <div className="crm-login-bg-blobs" />

      {/* Left Pane — Branding */}
      <div className="crm-login-left">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
              flexShrink: 0,
            }}>⚡</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>Agentic CRM</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>AI-Powered Operations</div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 52, fontWeight: 900, color: '#f1f5f9',
            lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20,
          }}>
            Customer Relations<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Reimagined.</span>
          </h1>

          <p style={{ fontSize: 17, color: '#94a3b8', maxWidth: 480, lineHeight: 1.65, marginBottom: 52 }}>
            Intelligent operations, autonomous fraud detection, and instant AI-driven resolutions — all in one platform.
          </p>

          {/* Feature Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Pane — Login Form */}
      <motion.div
        className="crm-login-right"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 20,
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#818cf8' }}>Secure Access</span>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>
            Sign in to access your CRM workspace
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', '& .MuiAlert-icon': { color: '#ef4444' } }}
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
              Phone Number
            </label>
            <TextField
              fullWidth
              placeholder="Enter your phone number"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              size="medium"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
              Password
            </label>
            <TextField
              fullWidth
              placeholder="Enter your password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="medium"
            />
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ py: 1.6, fontSize: 15 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In →'}
          </Button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Quick Access</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Demo Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: '🔐 Demo Admin', role: 'Admin' as const, color: '#6366f1' },
            { label: '👤 Demo User', role: 'User' as const, color: '#10b981' },
          ].map(({ label, role, color }) => (
            <button
              key={role}
              onClick={() => handleLogin(undefined, role)}
              disabled={loading}
              style={{
                flex: 1, padding: '11px 16px',
                background: `rgba(${role === 'Admin' ? '99,102,241' : '16,185,129'}, 0.08)`,
                border: `1px solid rgba(${role === 'Admin' ? '99,102,241' : '16,185,129'}, 0.25)`,
                borderRadius: 10, color, fontSize: 13, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', opacity: loading ? 0.5 : 1,
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = `rgba(${role === 'Admin' ? '99,102,241' : '16,185,129'}, 0.15)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `rgba(${role === 'Admin' ? '99,102,241' : '16,185,129'}, 0.08)`; }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 28, lineHeight: 1.6 }}>
          Demo credentials are pre-filled for client presentations.<br />
          All data is encrypted and secure.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

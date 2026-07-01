import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const EXPRESS_URL = 'http://localhost:2424';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${EXPRESS_URL}/api/auth/login`, { phone, password });

      login(res.data.token, res.data.user);

      if (res.data.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role: 'admin' | 'user') => {
    setPhone(role === 'admin' ? '0000000000' : '1111111111');
    setPassword(role === 'admin' ? 'AdminPassword123' : 'UserPassword123');
  };

  return (
    <div className="crm-login-page">

      {/* ── Left pane: Clean, humanised branding panel ── */}
      <div className="crm-login-left">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ flex: 1 }}>
            {/* Wordmark */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#ffffff' }}>Sentia</span>
                <span style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>.ai</span>
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                CRM, Reimagined with AI
              </div>
            </div>
          </div>

          <div>
            <h1 style={{
              fontSize: 56, fontWeight: 900, color: '#ffffff',
              lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 16,
            }}>
              Customer intelligence<br />
              <span style={{
                background: 'linear-gradient(135deg, #e0e7ff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>for modern e-commerce.</span>
            </h1>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px',
              background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.1), rgba(59, 130, 246, 0.1))',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 30,
              boxShadow: '0 0 15px rgba(56,189,248,0.15)',
              fontSize: 13, color: '#38bdf8', fontWeight: 700, marginBottom: 24, letterSpacing: '0.04em', textTransform: 'uppercase'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              Powered by Amazon Datasets
            </div>

            <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 460, lineHeight: 1.6, marginBottom: 28, fontWeight: 400 }}>
              Sentia acts as an intelligent backend co-pilot for your support team, automating the heavy lifting so agents can focus on building relationships.
            </p>

            {/* Clean Professional Features List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: 'RAG-Powered Auto-Drafts', desc: 'Our AI instantly generates context-aware response drafts using domain-specific e-commerce knowledge.' },
                { title: 'Sentiment & Fraud Analysis', desc: 'Evaluates customer mood and flags high-risk returns or fraudulent claims in real-time.' },
                { title: 'Intelligent Ticket Routing', desc: 'Automatically categorizes and assigns tickets to the right department, reducing manual triage time.' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right pane: Login Form ── */}
      <div className="crm-login-right" style={{ background: '#ffffff', borderLeft: '1px solid #e2e8f0' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={{ marginBottom: 36 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 6,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              marginBottom: 20,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1c39bb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Secure Access</span>
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Welcome back
            </h2>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              Sign in to manage your customer support operations.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 8,
                  border: '1px solid #cbd5e1', background: '#fff',
                  color: '#0f172a', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onFocus={e => e.target.style.borderColor = '#1c39bb'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                placeholder="0000000000"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 8,
                  border: '1px solid #cbd5e1', background: '#fff',
                  color: '#0f172a', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onFocus={e => e.target.style.borderColor = '#1c39bb'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: 13, background: 'rgba(239, 68, 68, 0.1)', padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 8,
                background: '#1c39bb',
                color: 'white', fontSize: 14, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                marginTop: 8,
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
                boxShadow: '0 4px 12px rgba(28,57,187,0.3)'
              }}
            >
              {loading ? 'Authenticating...' : 'Sign in to workspace'}
            </button>
          </form>

          <div style={{ marginTop: 40, borderTop: '1px solid #e2e8f0', paddingTop: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              Platform Demo Access
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => demoLogin('admin')}
                style={{
                  flex: 1, padding: '10px', borderRadius: 6,
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  color: '#475569', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
              >
                Support Manager
              </button>
              <button
                onClick={() => demoLogin('user')}
                style={{
                  flex: 1, padding: '10px', borderRadius: 6,
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  color: '#475569', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
              >
                Customer Portal
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

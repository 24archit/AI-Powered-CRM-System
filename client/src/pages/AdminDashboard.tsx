import { useState } from 'react';
import { CircularProgress, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import IntelligentQueue from '../components/IntelligentQueue';

const EXPRESS_URL = 'http://localhost:2424';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', active: true },
  { icon: '🎫', label: 'Tickets Queue', badge: null },
  { icon: '👥', label: 'Customers', badge: null },
  { icon: '🤖', label: 'AI Insights', badge: null },
  { icon: '📈', label: 'Analytics', badge: null },
  { icon: '⚙️', label: 'Settings', badge: null },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: '#1e2130', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '10px 14px', fontSize: 13,
      }}>
        <div style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#f1f5f9', fontWeight: 700 }}>{payload[0].value}</div>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('Dashboard');

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['allTickets'],
    queryFn: async () => {
      const res = await axios.get(`${EXPRESS_URL}/api/tickets`);
      return res.data;
    },
    refetchInterval: 5000,
  });

  // Derived metrics
  const totalTickets = tickets?.length || 0;
  const highFraud = tickets?.filter((t: any) => t.fraudRisk > 0.5).length || 0;
  const duplicates = tickets?.filter((t: any) => t.isDuplicate).length || 0;
  const resolved = tickets?.filter((t: any) => t.status === 'Resolved').length || 0;

  // Chart data
  const categoryCount = tickets?.reduce((acc: any, t: any) => {
    acc[t.aiCategory || 'Uncategorized'] = (acc[t.aiCategory || 'Uncategorized'] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.keys(categoryCount || {}).map(k => ({ name: k, value: categoryCount[k] }));

  const sentimentCount = tickets?.reduce((acc: any, t: any) => {
    acc[t.aiSentiment || 'Neutral'] = (acc[t.aiSentiment || 'Neutral'] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.keys(sentimentCount || {}).map(k => ({ name: k, count: sentimentCount[k] }));

  const kpis = [
    { label: 'Total Tickets', value: totalTickets, icon: '🎫', color: 'primary', change: '+12% this week' },
    { label: 'Fraud Alerts', value: highFraud, icon: '🛡️', color: 'danger', change: `${totalTickets ? ((highFraud / totalTickets) * 100).toFixed(0) : 0}% of total` },
    { label: 'Duplicates', value: duplicates, icon: '📋', color: 'warning', change: 'Semantic matches' },
    { label: 'Resolved', value: resolved, icon: '✅', color: 'success', change: `${totalTickets ? ((resolved / totalTickets) * 100).toFixed(0) : 0}% resolution rate` },
  ];

  return (
    <div className="crm-layout">
      {/* Sidebar */}
      <aside className="crm-sidebar">
        {/* Logo */}
        <div className="crm-sidebar-logo">
          <div className="crm-sidebar-logo-icon">⚡</div>
          <div>
            <div className="crm-sidebar-logo-text">Agentic CRM</div>
            <div className="crm-sidebar-logo-sub">AI Operations</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="crm-nav-section">
          <div className="crm-nav-label">Main Menu</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.label}
              className={`crm-nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Tickets Queue' && totalTickets > 0 && (
                <span className="crm-nav-badge">{totalTickets}</span>
              )}
              {item.label === 'Fraud Alerts' && highFraud > 0 && (
                <span className="crm-nav-badge" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>{highFraud}</span>
              )}
            </div>
          ))}
        </div>

        <div className="crm-nav-section" style={{ marginTop: 8 }}>
          <div className="crm-nav-label">Risk Alerts</div>
          {highFraud > 0 && (
            <div style={{
              padding: '12px 14px', borderRadius: 10, marginBottom: 6,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f87171', marginBottom: 4 }}>🚨 Fraud Alerts</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{highFraud} ticket{highFraud !== 1 ? 's' : ''} require review</div>
            </div>
          )}
        </div>

        {/* User Footer */}
        <div className="crm-sidebar-footer">
          <div className="crm-user-card" onClick={logout} title="Click to logout">
            <div className="crm-user-avatar">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="crm-user-name truncate">{user?.name || 'Admin'}</div>
              <div className="crm-user-role">Administrator</div>
            </div>
            <span style={{ fontSize: 16, color: '#64748b' }}>→</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="crm-main">
        {/* Top Bar */}
        <div className="crm-topbar">
          <div>
            <div className="crm-topbar-title">Agentic Insights</div>
            <div className="crm-topbar-subtitle">Real-time AI operations overview</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Live indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px',
              background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 20,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#10b981',
                boxShadow: '0 0 8px #10b981', display: 'inline-block',
                animation: 'pulse-dot 2s infinite',
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399' }}>Live</span>
            </div>
            <Button
              variant="outlined"
              size="small"
              onClick={logout}
              sx={{ fontSize: 12, py: 0.7, px: 2 }}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="crm-content">
          {/* KPI Cards */}
          <div className="crm-kpi-grid">
            {kpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                className={`crm-kpi-card ${kpi.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="crm-kpi-label">{kpi.label}</div>
                <div className="crm-kpi-value">
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : kpi.value}
                </div>
                <div className="crm-kpi-change text-muted" style={{ fontSize: 12 }}>
                  {kpi.change}
                </div>
                <div className="crm-kpi-icon" style={{
                  background: kpi.color === 'primary' ? 'rgba(99,102,241,0.1)'
                    : kpi.color === 'danger' ? 'rgba(239,68,68,0.1)'
                      : kpi.color === 'warning' ? 'rgba(245,158,11,0.1)'
                        : 'rgba(16,185,129,0.1)',
                }}>
                  {kpi.icon}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="crm-charts-grid">
            {/* Bar Chart */}
            <motion.div
              className="crm-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="crm-card-header">
                <div>
                  <div className="crm-card-title">Sentiment Analysis</div>
                  <div className="crm-card-subtitle">Customer sentiment distribution</div>
                </div>
              </div>
              <div className="crm-card-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={28}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
                      {barData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              className="crm-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="crm-card-header">
                <div>
                  <div className="crm-card-title">Category Distribution</div>
                  <div className="crm-card-subtitle">Ticket breakdown by AI category</div>
                </div>
              </div>
              <div className="crm-card-body" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData} cx="50%" cy="50%"
                      innerRadius={65} outerRadius={100}
                      paddingAngle={4} dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Intelligent Triage Queue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="crm-card">
              <div className="crm-card-header">
                <div>
                  <div className="crm-card-title">🎯 Intelligent Triage Queue</div>
                  <div className="crm-card-subtitle">AI-prioritized tickets with fraud & duplicate detection</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {highFraud > 0 && (
                    <span className="crm-badge fraud">
                      <span className="crm-badge-dot" />
                      {highFraud} Fraud
                    </span>
                  )}
                  {duplicates > 0 && (
                    <span className="crm-badge duplicate">
                      <span className="crm-badge-dot" />
                      {duplicates} Duplicate
                    </span>
                  )}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <IntelligentQueue tickets={tickets} isLoading={isLoading} />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

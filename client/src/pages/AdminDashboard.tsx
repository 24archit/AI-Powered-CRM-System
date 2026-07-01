import { useState, useEffect } from 'react';
import { CircularProgress, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Line, ScatterChart, Scatter, ZAxis, LineChart
} from 'recharts';
import IntelligentQueue from '../components/IntelligentQueue';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const EXPRESS_URL = 'http://localhost:2424';

const COLORS = ['#1c39bb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const NAV_ITEMS = [
  { icon: <DashboardIcon fontSize="small" />, label: 'Dashboard', active: true },
  { icon: <ListAltIcon fontSize="small" />, label: 'Tickets Queue', badge: null },
  { icon: <PeopleIcon fontSize="small" />, label: 'Customers', badge: null },
  { icon: <SmartToyIcon fontSize="small" />, label: 'AI Insights', badge: null },
  { icon: <ShowChartIcon fontSize="small" />, label: 'Analytics', badge: null },
  { icon: <SettingsIcon fontSize="small" />, label: 'Settings', badge: null },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: '#ffffff', border: '1px solid #e2e8f0',
        borderRadius: 10, padding: '10px 14px', fontSize: 13,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{ color: '#64748b', marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#0f172a', fontWeight: 700 }}>
          {payload.map((p: any, i: number) => (
            <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeNav]);

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

  // Ticket Volume Trend (Area Chart)
  const areaData = [
    { time: '08:00', volume: 12 }, { time: '10:00', volume: 19 },
    { time: '12:00', volume: 30 }, { time: '14:00', volume: 24 },
    { time: '16:00', volume: 35 }, { time: '18:00', volume: 20 },
  ];

  // AI Confidence Scores (Radar Chart)
  const radarData = [
    { subject: 'Categorization', A: 92, fullMark: 100 },
    { subject: 'Sentiment', A: 88, fullMark: 100 },
    { subject: 'Fraud', A: 95, fullMark: 100 },
    { subject: 'Resolution', A: 85, fullMark: 100 },
    { subject: 'Deduplication', A: 90, fullMark: 100 },
  ];
  
  // Resolution Performance (Composed Chart)
  const composedData = [
    { name: 'Mon', time: 24, count: 40 },
    { name: 'Tue', time: 20, count: 50 },
    { name: 'Wed', time: 15, count: 65 },
    { name: 'Thu', time: 18, count: 55 },
    { name: 'Fri', time: 12, count: 80 },
  ];

  // 5. Auto-Resolution Rate
  const autoResolutionData = [
    { day: 'Mon', rate: 75 },
    { day: 'Tue', rate: 82 },
    { day: 'Wed', rate: 85 },
    { day: 'Thu', rate: 79 },
    { day: 'Fri', rate: 91 },
  ];

  // 6. Fraud Risk Distribution
  const fraudData = [
    { range: '0-20%', count: 45 },
    { range: '20-40%', count: 12 },
    { range: '40-60%', count: 5 },
    { range: '60-80%', count: 3 },
    { range: '80-100%', count: 8 },
  ];

  // 7. CSAT Trend
  const csatData = [
    { month: 'Jan', score: 4.2 },
    { month: 'Feb', score: 4.5 },
    { month: 'Mar', score: 4.7 },
    { month: 'Apr', score: 4.6 },
    { month: 'May', score: 4.8 },
  ];

  // 8. AI Categorization Accuracy (Scatter)
  const accuracyData = [
    { category: 1, accuracy: 90, volume: 200 },
    { category: 2, accuracy: 95, volume: 150 },
    { category: 3, accuracy: 88, volume: 300 },
    { category: 4, accuracy: 92, volume: 120 },
    { category: 5, accuracy: 98, volume: 80 },
  ];

  const kpis = [
    { label: 'Total Tickets', value: totalTickets, color: 'primary', change: '+12% this week', icon: <ListAltIcon /> },
    { label: 'Fraud Alerts', value: highFraud, color: 'danger', change: `${totalTickets ? ((highFraud / totalTickets) * 100).toFixed(0) : 0}% of total`, icon: <SmartToyIcon /> },
    { label: 'Duplicates', value: duplicates, color: 'warning', change: 'Semantic matches', icon: <PeopleIcon /> },
    { label: 'Resolved', value: resolved, color: 'success', change: `${totalTickets ? ((resolved / totalTickets) * 100).toFixed(0) : 0}% resolution rate`, icon: <ShowChartIcon /> },
  ];

  return (
    <div className="crm-layout">
      {/* Mobile Overlay */}
      <div 
        className={`crm-mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`crm-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="crm-sidebar-logo">
          <div className="crm-sidebar-logo-text" style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#ffffff' }}>Sentia</span>
            <span style={{ 
              background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>.ai</span>
          </div>
          <div className="crm-sidebar-logo-sub" style={{ marginLeft: 2, marginTop: 4 }}>AI-Powered CRM for E-Commerce</div>
        </div>

        {/* Navigation */}
        <div className="crm-nav-section">
          <div className="crm-nav-label">Main Menu</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.label}
              className={`crm-nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.label);
                setMobileMenuOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Tickets Queue' && totalTickets > 0 && (
                <span className="crm-nav-badge">{totalTickets}</span>
              )}
              {item.label === 'Dashboard' && highFraud > 0 && (
                <span className="crm-nav-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{highFraud}</span>
              )}
            </div>
          ))}
        </div>

        <div className="crm-nav-section" style={{ marginTop: 8 }}>
          <div className="crm-nav-label">Risk Alerts</div>
          {highFraud > 0 && (
            <div style={{
              padding: '12px 14px', borderRadius: 10, marginBottom: 6,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.1)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>Fraud Alerts</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{highFraud} ticket{highFraud !== 1 ? 's' : ''} require review</div>
            </div>
          )}
        </div>

        {/* User Footer */}
        <div className="crm-sidebar-footer">
          <div className="crm-user-card" onClick={logout} title="Click to logout">
            <div className="crm-user-avatar" style={{ background: '#1c39bb' }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="crm-user-name truncate">{user?.name || 'Admin'}</div>
              <div className="crm-user-role">Administrator</div>
            </div>
            <LogoutIcon fontSize="small" style={{ color: '#64748b' }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="crm-main">
        {/* Top Bar */}
        <div className="crm-topbar">
          <button className="crm-mobile-hamburger" onClick={() => setMobileMenuOpen(true)}>
            <MenuIcon />
          </button>
          <div>
            <div className="crm-topbar-title">Sentia Dashboard</div>
            <div className="crm-topbar-subtitle">Analyze AI performance, customer sentiment, and flagged fraud risks.</div>
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
              <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>Live</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="crm-content">
          
          {activeNav === 'Dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
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
                      color: kpi.color === 'primary' ? '#1c39bb'
                        : kpi.color === 'danger' ? '#ef4444'
                          : kpi.color === 'warning' ? '#f59e0b'
                            : '#10b981',
                      background: kpi.color === 'primary' ? 'rgba(28,57,187,0.1)'
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
                
                {/* Area Chart: Ticket Volume */}
                <div className="crm-card">
                  <div className="crm-card-header">
                    <div>
                      <div className="crm-card-title">Ticket Volume</div>
                      <div className="crm-card-subtitle">Intake trends over time</div>
                    </div>
                  </div>
                  <div className="crm-card-body" style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData}>
                        <defs>
                          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1c39bb" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1c39bb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="volume" stroke="#1c39bb" fillOpacity={1} fill="url(#colorVolume)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Composed Chart: Resolution Performance */}
                <div className="crm-card">
                  <div className="crm-card-header">
                    <div>
                      <div className="crm-card-title">Resolution Performance</div>
                      <div className="crm-card-subtitle">Time-to-resolve vs Ticket Volume</div>
                    </div>
                  </div>
                  <div className="crm-card-body" style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={composedData}>
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Bar yAxisId="left" dataKey="count" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                        <Line yAxisId="right" type="monotone" dataKey="time" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart: Sentiment */}
                <div className="crm-card">
                  <div className="crm-card-header">
                    <div>
                      <div className="crm-card-title">Sentiment Analysis</div>
                      <div className="crm-card-subtitle">Customer sentiment distribution</div>
                    </div>
                  </div>
                  <div className="crm-card-body" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} barSize={28}>
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                        <Bar dataKey="count" fill="#1c39bb" radius={[6, 6, 0, 0]}>
                          {barData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar Chart: AI Confidence */}
                <div className="crm-card">
                  <div className="crm-card-header">
                    <div>
                      <div className="crm-card-title">AI Confidence Scores</div>
                      <div className="crm-card-subtitle">Model accuracy across modules</div>
                    </div>
                  </div>
                  <div className="crm-card-body" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                        <Radar name="Confidence" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                        <RechartsTooltip content={<CustomTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5. Pie Chart: Category Distribution */}
                <div className="crm-card">
                  <div className="crm-card-header">
                    <div>
                      <div className="crm-card-title">Category Distribution</div>
                      <div className="crm-card-subtitle">Ticket breakdown by AI category</div>
                    </div>
                  </div>
                  <div className="crm-card-body" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ color: '#64748b', fontSize: 12 }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 6. Line Chart: Auto-Resolution Rate */}
                <div className="crm-card">
                  <div className="crm-card-header">
                    <div>
                      <div className="crm-card-title">Auto-Resolution Rate</div>
                      <div className="crm-card-subtitle">AI autonomous handling %</div>
                    </div>
                  </div>
                  <div className="crm-card-body" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={autoResolutionData}>
                        <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 7. Bar Chart: Fraud Risk Distribution */}
                <div className="crm-card">
                  <div className="crm-card-header">
                    <div>
                      <div className="crm-card-title">Fraud Risk Distribution</div>
                      <div className="crm-card-subtitle">Risk level thresholds across tickets</div>
                    </div>
                  </div>
                  <div className="crm-card-body" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={fraudData} barSize={24} layout="vertical">
                        <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="range" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                        <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 8. Line Chart: CSAT Trend */}
                <div className="crm-card">
                  <div className="crm-card-header">
                    <div>
                      <div className="crm-card-title">Customer Satisfaction</div>
                      <div className="crm-card-subtitle">CSAT score trend over time</div>
                    </div>
                  </div>
                  <div className="crm-card-body" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={csatData}>
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[3.5, 5]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>


              </div>
            </motion.div>
          )}

          {activeNav === 'Tickets Queue' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Intelligent Triage Queue */}
              <div className="crm-card" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                <div className="crm-card-header" style={{ flexShrink: 0 }}>
                  <div>
                    <div className="crm-card-title">Intelligent Triage Queue</div>
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
                <div style={{ overflow: 'auto', flex: 1 }}>
                  <IntelligentQueue tickets={tickets} isLoading={isLoading} />
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

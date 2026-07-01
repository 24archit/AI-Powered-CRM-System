import { useState, useEffect } from 'react';
import {
  Button, TextField, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import HistoryIcon from '@mui/icons-material/History';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const EXPRESS_URL = 'http://localhost:2424';

const NAV_ITEMS = [
  { icon: <InboxIcon fontSize="small" />, label: 'My Tickets', active: true },
  { icon: <AddCircleOutlinedIcon fontSize="small" />, label: 'New Request' },
  { icon: <HistoryIcon fontSize="small" />, label: 'History' },
  { icon: <ChatBubbleOutlinedIcon fontSize="small" />, label: 'Feedback' },
];

const statusBadge = (status: string) => {
  const map: Record<string, { cls: string; label: string }> = {
    Open: { cls: 'open', label: '● Open' },
    Resolved: { cls: 'resolved', label: '✓ Resolved' },
    Pending: { cls: 'pending', label: '◌ Pending' },
  };
  const s = map[status] || { cls: 'pending', label: status };
  return <span className={`crm-badge ${s.cls}`}>{s.label}</span>;
};

const sentimentBadge = (sentiment: string) => {
  if (!sentiment) return null;
  const cls = sentiment === 'Positive' ? 'positive' : sentiment === 'Negative' || sentiment === 'Angry' ? 'negative' : 'neutral';
  return <span className={`crm-badge ${cls}`}>{sentiment}</span>;
};

const UserPortal = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('My Tickets');

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeNav]);

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['userTickets'],
    queryFn: async () => {
      const res = await axios.get(`${EXPRESS_URL}/api/tickets`);
      return res.data;
    },
  });

  const submitTicket = useMutation({
    mutationFn: async (newTicket: any) => {
      const res = await axios.post(`${EXPRESS_URL}/api/tickets`, newTicket);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTickets'] });
      setOpen(false);
      setSubject('');
      setDescription('');
      setUploadedImage('');
      setReferenceImage('');
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!subject || !description) return;
    let defectBase64 = uploadedImage;
    if (uploadedImage.includes(',')) defectBase64 = uploadedImage.split(',')[1];

    let referenceBase64 = referenceImage;
    if (referenceImage.includes(',')) referenceBase64 = referenceImage.split(',')[1];

    submitTicket.mutate({
      subject, description,
      uploaded_image_b64: defectBase64 || undefined,
      product_image_b64: referenceBase64 || undefined,
    });
  };

  const openTickets = tickets?.filter((t: any) => t.status !== 'Resolved').length || 0;
  const resolvedTickets = tickets?.filter((t: any) => t.status === 'Resolved').length || 0;

  return (
    <div className="crm-layout">
      {/* Mobile Overlay */}
      <div 
        className={`crm-mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`crm-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="crm-sidebar-logo" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="crm-sidebar-logo-text" style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#ffffff' }}>Sentia</span>
            <span style={{ 
              background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>.ai</span>
          </div>
          <div className="crm-sidebar-logo-sub" style={{ marginLeft: 2, marginTop: 4 }}>Customer Support Portal</div>
        </div>

        <div className="crm-nav-section">
          <div className="crm-nav-label">Navigation</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.label}
              className={`crm-nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => {
                if (item.label === 'New Request') {
                  setOpen(true);
                } else {
                  setActiveNav(item.label);
                }
                setMobileMenuOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'My Tickets' && openTickets > 0 && (
                <span className="crm-nav-badge">{openTickets}</span>
              )}
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div style={{ padding: '8px 12px' }}>
          <div style={{
            padding: '14px', borderRadius: 10,
            background: 'rgba(0,0,0,0.03)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Your Stats
            </div>
            {[
              { label: 'Open', value: openTickets, color: '#f59e0b' },
              { label: 'Resolved', value: resolvedTickets, color: '#10b981' },
              { label: 'Total', value: tickets?.length || 0, color: '#6366f1' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>


        {/* User Footer */}
        <div className="crm-sidebar-footer">
          <div className="crm-user-card" onClick={logout} title="Click to logout">
            <div className="crm-user-avatar" style={{ background: '#1c39bb' }}>
              {user?.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="crm-user-name truncate">{user?.name || 'Customer'}</div>
              <div className="crm-user-role">User Portal</div>
            </div>
            <LogoutIcon fontSize="small" style={{ color: '#64748b' }} />
          </div>
        </div>

      </aside>

      {/* Main */}
      <main className="crm-main">
        {/* Topbar */}
        <div className="crm-topbar">
          <button className="crm-mobile-hamburger" onClick={() => setMobileMenuOpen(true)}>
            <MenuIcon />
          </button>
          <div>
            <div className="crm-topbar-title">My Support Tickets</div>
            <div className="crm-topbar-subtitle">Track and manage your requests</div>
          </div>
          <div className="crm-hide-mobile" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setOpen(true)}
              sx={{ fontSize: 13, py: 0.8 }}
            >
              + New Ticket
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="crm-content">
          {activeNav === 'My Tickets' && (
            isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
                <CircularProgress />
              </div>
            ) : !tickets || tickets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: 'center', padding: '80px 40px',
                  background: 'var(--crm-surface)',
                  border: '1px solid var(--crm-border)',
                  borderRadius: 16,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8, marginTop: 16 }}>
                  No open tickets!
                </div>
                <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>
                  Everything is looking good. Create a new ticket if you need help.
                </div>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                  Create Support Ticket
                </Button>
              </motion.div>
            ) : (
              <div>
                <AnimatePresence>
                  {[...tickets].reverse().map((ticket: any, index: number) => (
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      className="crm-ticket-card"
                      onClick={() => setSelectedTicket(ticket)}
                      style={{ position: 'relative', overflow: 'hidden' }}
                    >
                      {/* Ticket Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div style={{ flex: 1, paddingRight: 20 }}>
                          <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.01em' }}>
                            {ticket.subject}
                          </div>
                          <div style={{ 
                            fontSize: 14, color: '#64748b', lineHeight: 1.5,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                          }}>
                            "{ticket.description}"
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                          {statusBadge(ticket.status)}
                          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>
                            #{ticket._id?.slice(-6).toUpperCase() || 'TICKET'}
                          </span>
                        </div>
                      </div>

                      {/* AI / Agent Response Preview */}
                      {ticket.aiProcessed ? (
                        <div style={{
                          marginTop: 16, padding: '14px 16px', borderRadius: 8,
                          background: 'rgba(28,57,187,0.04)', border: '1px solid rgba(28,57,187,0.15)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                             <span style={{ fontSize: 11, fontWeight: 700, color: '#1c39bb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                               Sentia Assistant
                             </span>
                          </div>
                          <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6 }}>
                            {ticket.aiSuggestedResponse || 'An agent has been assigned and will review your ticket shortly.'}
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          marginTop: 16, padding: '12px 16px', borderRadius: 10,
                          background: '#f8fafc', border: '1px dashed #cbd5e1',
                          display: 'flex', alignItems: 'center', gap: 10
                        }}>
                          <CircularProgress size={16} sx={{ color: '#94a3b8' }} />
                          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                            Routing to the best available agent...
                          </span>
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                        marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.04)' 
                      }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {ticket.aiCategory && (
                            <span style={{ 
                              padding: '4px 12px', background: '#f1f5f9', borderRadius: 6, 
                              fontSize: 11, fontWeight: 600, color: '#475569', border: '1px solid #e2e8f0'
                            }}>
                              {ticket.aiCategory}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1c39bb', display: 'flex', alignItems: 'center', gap: 4 }}>
                          View Details 
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )
          )}

          {['History', 'Feedback'].includes(activeNav) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center', padding: '80px 40px',
                background: 'var(--crm-surface)', border: '1px solid var(--crm-border)', borderRadius: 16,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                {activeNav} Module Coming Soon
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8' }}>
                We are currently building this feature. Check back later!
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Create Ticket Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pb: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Submit Support Request</div>
          <div style={{
            marginTop: 12, padding: '12px 16px', borderRadius: 8,
            background: 'rgba(28,57,187,0.06)', border: '1px solid rgba(28,57,187,0.1)',
            fontSize: 13, color: '#1e293b', lineHeight: 1.5
          }}>
            <strong style={{ color: '#1c39bb', marginRight: 4 }}>💡 Pro Tip:</strong>
            Try submitting a detailed issue (e.g., "My product arrived damaged and I want a refund"). Our AI backend will automatically analyze sentiment, categorize the issue, and route it to the right department.
          </div>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
              Subject *
            </label>
            <TextField
              autoFocus
              fullWidth
              placeholder="Briefly describe your issue"
              variant="outlined"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              size="small"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
              Description *
            </label>
            <TextField
              fullWidth
              placeholder="Describe your issue in detail (e.g., My order is broken...)"
              multiline
              rows={4}
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                htmlFor="img-upload"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 16px',
                  border: uploadedImage ? '1px solid #10b981' : '1px dashed #cbd5e1',
                  borderRadius: 10, cursor: 'pointer',
                  background: uploadedImage ? 'rgba(16,185,129,0.04)' : '#f8fafc',
                  transition: 'all 0.2s',
                  color: uploadedImage ? '#10b981' : '#64748b',
                  fontSize: 13, fontWeight: 600,
                }}
              >
                <span>{uploadedImage ? 'Defect Image Attached' : 'Attach Defect Image'}</span>
                <input id="img-upload" type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </label>
              <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center', padding: '0 4px' }}>
                Upload a clear photo showing the damage or defect.
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                htmlFor="ref-upload"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 16px',
                  border: referenceImage ? '1px solid #10b981' : '1px dashed #cbd5e1',
                  borderRadius: 10, cursor: 'pointer',
                  background: referenceImage ? 'rgba(16,185,129,0.04)' : '#f8fafc',
                  transition: 'all 0.2s',
                  color: referenceImage ? '#10b981' : '#64748b',
                  fontSize: 13, fontWeight: 600,
                }}
              >
                <span>{referenceImage ? 'Reference Attached' : 'Attach Original Image'}</span>
                <input id="ref-upload" type="file" hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setReferenceImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
              <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center', padding: '0 4px' }}>
                Upload a screenshot of the original product listing or receipt.
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={submitTicket.isPending || !subject || !description}
          >
            {submitTicket.isPending ? (
              <><CircularProgress size={16} color="inherit" sx={{ mr: 1 }} /> Submitting...</>
            ) : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onClose={() => setSelectedTicket(null)} fullWidth maxWidth="md">
        <DialogTitle sx={{ pb: 1, pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
          <div className="crm-dialog-header-flex">
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{selectedTicket?.subject}</div>
            {selectedTicket && statusBadge(selectedTicket.status)}
          </div>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Your Description
            </div>
            <div style={{
              padding: '14px 16px', borderRadius: 10,
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.06)',
              fontSize: 14, color: '#475569', lineHeight: 1.6,
            }}>
              {selectedTicket?.description}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              AI Analysis
            </div>
            <div className="crm-ai-analysis-grid">
              {[
                { label: 'Category', value: selectedTicket?.aiCategory || 'Processing...', color: '#1c39bb' },
                { label: 'Sentiment', value: selectedTicket?.aiSentiment || 'Processing...', color: selectedTicket?.aiSentiment === 'Negative' ? '#ef4444' : selectedTicket?.aiSentiment === 'Positive' ? '#10b981' : '#475569' },
                { label: 'Fraud Risk', value: selectedTicket?.fraudRisk != null ? `${(selectedTicket.fraudRisk * 100).toFixed(1)}%` : 'Processing...', color: selectedTicket?.fraudRisk > 0.5 ? '#ef4444' : '#10b981' },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '14px', borderRadius: 10, textAlign: 'center',
                  background: 'rgba(0,0,0,0.02)',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {selectedTicket?.aiSuggestedResponse && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                AI Draft Response
              </div>
              <div className="crm-ai-panel">
                <div className="crm-ai-label" style={{ color: '#1c39bb' }}>
                  Agentic Auto-Draft
                </div>
                <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.65 }}>
                  {selectedTicket.aiSuggestedResponse}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
          <Button size="small" onClick={() => setSelectedTicket(null)} sx={{ color: '#64748b' }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Mobile FAB for New Ticket */}
      <div 
        className="crm-mobile-only flex" 
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<AddCircleOutlinedIcon />}
          style={{ 
            borderRadius: 28, height: 56, padding: '0 24px', 
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            textTransform: 'none', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em'
          }}
        >
          New Ticket
        </Button>
      </div>
    </div>
  );
};

export default UserPortal;

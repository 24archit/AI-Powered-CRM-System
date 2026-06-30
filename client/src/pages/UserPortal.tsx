import { useState } from 'react';
import {
  Button, TextField, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const EXPRESS_URL = 'http://localhost:2424';

const NAV_ITEMS = [
  { icon: '🏠', label: 'My Tickets', active: true },
  { icon: '📝', label: 'New Request' },
  { icon: '📂', label: 'History' },
  { icon: '💬', label: 'Feedback' },
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
  const emoji = sentiment === 'Positive' ? '😊' : sentiment === 'Negative' || sentiment === 'Angry' ? '😠' : '😐';
  return <span className={`crm-badge ${cls}`}>{emoji} {sentiment}</span>;
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
  const [activeNav, setActiveNav] = useState('My Tickets');

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
      {/* Sidebar */}
      <aside className="crm-sidebar">
        <div className="crm-sidebar-logo">
          <div className="crm-sidebar-logo-icon">💬</div>
          <div>
            <div className="crm-sidebar-logo-text">Support Portal</div>
            <div className="crm-sidebar-logo-sub">Customer Access</div>
          </div>
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
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
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

        <div className="crm-sidebar-footer">
          <div className="crm-user-card" onClick={logout} title="Click to logout">
            <div className="crm-user-avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="crm-user-name truncate">{user?.name || 'User'}</div>
              <div className="crm-user-role">Customer</div>
            </div>
            <span style={{ fontSize: 16, color: '#64748b' }}>→</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="crm-main">
        {/* Topbar */}
        <div className="crm-topbar">
          <div>
            <div className="crm-topbar-title">My Support Tickets</div>
            <div className="crm-topbar-subtitle">Track and manage your requests</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setOpen(true)}
              sx={{ fontSize: 13, py: 0.8 }}
            >
              + New Ticket
            </Button>
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
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
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
                  {tickets.map((ticket: any, index: number) => (
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      className="crm-ticket-card"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      {/* Ticket Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                            {ticket.subject}
                          </div>
                          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginRight: 16 }}>
                            {ticket.description?.length > 120 ? ticket.description.slice(0, 120) + '...' : ticket.description}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                          {statusBadge(ticket.status)}
                          {sentimentBadge(ticket.aiSentiment)}
                        </div>
                      </div>

                      {/* AI Response */}
                      {ticket.aiProcessed && (
                        <div className="crm-ai-panel">
                          <div className="crm-ai-label">
                            <span className="crm-ai-label-dot" />
                            AI Assistant Response
                          </div>
                          <div style={{ fontSize: 13, color: '#c7d2fe', lineHeight: 1.6 }}>
                            {ticket.aiSuggestedResponse || 'An agent will review your ticket shortly.'}
                          </div>
                        </div>
                      )}

                      {!ticket.aiProcessed && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '10px 14px', borderRadius: 10, marginTop: 12,
                          background: 'rgba(99,102,241,0.06)',
                          border: '1px solid rgba(99,102,241,0.12)',
                        }}>
                          <CircularProgress size={14} sx={{ color: '#818cf8' }} />
                          <span style={{ fontSize: 12, color: '#818cf8', fontWeight: 500 }}>
                            AI is processing your request...
                          </span>
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                        {ticket.aiCategory && (
                          <span className="crm-badge neutral">
                            🏷️ {ticket.aiCategory}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>
                          Click to view details →
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
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
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
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>Submit Support Request</div>
          <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400, marginTop: 4 }}>
            Our AI will analyze and prioritize your ticket automatically.
          </div>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
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
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
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
            <label
              htmlFor="img-upload"
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 16px',
                border: '1px dashed rgba(99,102,241,0.3)',
                borderRadius: 10, cursor: 'pointer',
                background: 'rgba(99,102,241,0.04)',
                transition: 'all 0.2s',
                color: uploadedImage ? '#34d399' : '#818cf8',
                fontSize: 13, fontWeight: 500,
              }}
            >
              <span>{uploadedImage ? '✅' : '📸'}</span>
              <span>{uploadedImage ? 'Defect Image Attached' : 'Attach Defect Image'}</span>
              <input id="img-upload" type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </label>

            <label
              htmlFor="ref-upload"
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 16px',
                border: '1px dashed rgba(245,158,11,0.3)',
                borderRadius: 10, cursor: 'pointer',
                background: 'rgba(245,158,11,0.04)',
                transition: 'all 0.2s',
                color: referenceImage ? '#34d399' : '#fbbf24',
                fontSize: 13, fontWeight: 500,
              }}
            >
              <span>{referenceImage ? '✅' : '📦'}</span>
              <span>{referenceImage ? 'Reference Attached' : 'Attach Original Product Image'}</span>
              <input id="ref-upload" type="file" hidden accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setReferenceImage(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </label>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={submitTicket.isPending || !subject || !description}
          >
            {submitTicket.isPending ? (
              <><CircularProgress size={16} color="inherit" sx={{ mr: 1 }} /> Submitting...</>
            ) : '🤖 Submit to AI'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onClose={() => setSelectedTicket(null)} fullWidth maxWidth="md">
        <DialogTitle sx={{ pb: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>{selectedTicket?.subject}</div>
            {selectedTicket && statusBadge(selectedTicket.status)}
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Your Description
            </div>
            <div style={{
              padding: '14px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 14, color: '#cbd5e1', lineHeight: 1.6,
            }}>
              {selectedTicket?.description}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              AI Analysis
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { label: 'Category', value: selectedTicket?.aiCategory || 'Processing...', color: '#818cf8' },
                { label: 'Sentiment', value: selectedTicket?.aiSentiment || 'Processing...', color: selectedTicket?.aiSentiment === 'Negative' ? '#f87171' : selectedTicket?.aiSentiment === 'Positive' ? '#34d399' : '#94a3b8' },
                { label: 'Fraud Risk', value: selectedTicket?.fraudRisk != null ? `${(selectedTicket.fraudRisk * 100).toFixed(1)}%` : 'Processing...', color: selectedTicket?.fraudRisk > 0.5 ? '#f87171' : '#34d399' },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '14px', borderRadius: 10, textAlign: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {selectedTicket?.aiSuggestedResponse && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                AI Draft Response
              </div>
              <div className="crm-ai-panel">
                <div className="crm-ai-label">
                  <span className="crm-ai-label-dot" />
                  Agentic Auto-Draft
                </div>
                <div style={{ fontSize: 14, color: '#c7d2fe', lineHeight: 1.65 }}>
                  {selectedTicket.aiSuggestedResponse}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setSelectedTicket(null)} sx={{ color: '#94a3b8' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserPortal;

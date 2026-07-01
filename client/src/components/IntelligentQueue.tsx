import { useState } from 'react';
import {
  CircularProgress, Button, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { motion, AnimatePresence } from 'framer-motion';

const IntelligentQueue = ({ tickets, isLoading }: { tickets: any; isLoading: boolean }) => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 40px',
        color: '#64748b', fontSize: 14,
      }}>
        No tickets found in the queue.
      </div>
    );
  }

  const sentimentColor = (s: string) =>
    s === 'Positive' ? '#34d399' :
    s === 'Negative' || s === 'Angry' ? '#f87171' : '#94a3b8';

  const sentimentBg = (s: string) =>
    s === 'Positive' ? 'rgba(16,185,129,0.12)' :
    s === 'Negative' || s === 'Angry' ? 'rgba(239,68,68,0.12)' : 'rgba(148,163,184,0.08)';

  return (
    <>
      <div className="crm-table-container">
        <table className="crm-table">
        <thead>
          <tr>
            <th style={{ paddingLeft: 22 }}>Subject</th>
            <th>Customer</th>
            <th>Category</th>
            <th>Sentiment</th>
            <th>Fraud Risk</th>
            <th>Flags</th>
            <th style={{ textAlign: 'right', paddingRight: 22 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {[...tickets].reverse().map((ticket: any, index: number) => {
              const isHighFraud = ticket.fraudRisk > 0.5;
              const isAngry = ticket.aiSentiment === 'Negative' || ticket.aiSentiment === 'Angry';
              const isDuplicate = ticket.isDuplicate;

              return (
                <motion.tr
                  key={ticket._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`${isHighFraud ? 'fraud-row' : isDuplicate ? 'duplicate-row' : ''}`}
                  onClick={() => setSelectedTicket(ticket)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ paddingLeft: 22, maxWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      {isHighFraud && (
                        <span style={{
                          width: 3, height: '100%', minHeight: 36, borderRadius: 2,
                          background: '#ef4444', flexShrink: 0, display: 'inline-block', alignSelf: 'center',
                        }} />
                      )}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>
                          {ticket.subject}
                        </div>
                        <div style={{
                          fontSize: 11, color: '#64748b', maxWidth: 200,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {ticket.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
                      }}>
                        {ticket.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span style={{ fontSize: 13, color: '#475569' }}>{ticket.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td>
                    {ticket.aiCategory ? (
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 6,
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                        color: '#818cf8', fontSize: 12, fontWeight: 600,
                      }}>
                        {ticket.aiCategory}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: '#475569' }}>Processing...</span>
                    )}
                  </td>
                  <td>
                    {ticket.aiSentiment ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '3px 10px', borderRadius: 6,
                        background: sentimentBg(ticket.aiSentiment),
                        color: sentimentColor(ticket.aiSentiment),
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {ticket.aiSentiment}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: '#475569' }}>—</span>
                    )}
                  </td>
                  <td>
                    {ticket.fraudRisk != null ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 56, height: 5, borderRadius: 3,
                          background: 'rgba(0,0,0,0.06)', overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            width: `${ticket.fraudRisk * 100}%`,
                            background: isHighFraud
                              ? 'linear-gradient(90deg, #ef4444, #f97316)'
                              : 'linear-gradient(90deg, #10b981, #34d399)',
                          }} />
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: isHighFraud ? '#f87171' : '#34d399',
                        }}>
                          {(ticket.fraudRisk * 100).toFixed(0)}%
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#475569' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {isHighFraud && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 8px', borderRadius: 6,
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          color: '#f87171', fontSize: 11, fontWeight: 700,
                        }}>
                          <WarningAmberIcon sx={{ fontSize: 12 }} />
                          Fraud
                        </span>
                      )}
                      {isDuplicate && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 8px', borderRadius: 6,
                          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                          color: '#fbbf24', fontSize: 11, fontWeight: 700,
                        }}>
                          <ContentCopyIcon sx={{ fontSize: 12 }} />
                          Dupe
                        </span>
                      )}
                      {!isHighFraud && !isDuplicate && (
                        <span style={{ fontSize: 12, color: '#334155' }}>—</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: 22 }}>
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', borderRadius: 8,
                        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                        color: '#818cf8', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.16)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)'; }}
                    >
                      <VisibilityIcon sx={{ fontSize: 14 }} />
                      View
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
        </table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTicket} onClose={() => setSelectedTicket(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
          <div className="crm-dialog-header-flex">
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
                {selectedTicket?.subject}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                By {selectedTicket?.user?.name || 'Unknown Customer'}
              </div>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: 20,
              background: selectedTicket?.status === 'Open' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
              color: selectedTicket?.status === 'Open' ? '#fbbf24' : '#34d399',
              fontSize: 12, fontWeight: 700,
            }}>
              {selectedTicket?.status}
            </span>
          </div>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Customer Description
            </div>
            <div style={{
              padding: '14px 16px', borderRadius: 10,
              background: 'rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.06)',
              fontSize: 14, color: '#475569', lineHeight: 1.65,
            }}>
              {selectedTicket?.description}
            </div>
          </div>

          {/* AI Analysis Grid */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              AI Analysis & Categorization
            </div>
            <div className="crm-ai-analysis-grid">
              {[
                {
                  label: 'Predicted Category',
                  value: selectedTicket?.aiCategory || 'Processing...',
                  color: '#1c39bb',
                  bg: 'rgba(28,57,187,0.06)',
                },
                {
                  label: 'Sentiment',
                  value: selectedTicket?.aiSentiment || '—',
                  color: selectedTicket?.aiSentiment === 'Negative' || selectedTicket?.aiSentiment === 'Angry'
                    ? '#ef4444'
                    : selectedTicket?.aiSentiment === 'Positive' ? '#10b981' : '#475569',
                  bg: selectedTicket?.aiSentiment === 'Negative' || selectedTicket?.aiSentiment === 'Angry'
                    ? 'rgba(239,68,68,0.06)'
                    : selectedTicket?.aiSentiment === 'Positive' ? 'rgba(16,185,129,0.06)' : 'rgba(0,0,0,0.02)',
                },
                {
                  label: 'Fraud Risk',
                  value: selectedTicket?.fraudRisk != null
                    ? `${(selectedTicket.fraudRisk * 100).toFixed(1)}%`
                    : '—',
                  color: selectedTicket?.fraudRisk > 0.5 ? '#ef4444' : '#10b981',
                  bg: selectedTicket?.fraudRisk > 0.5 ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.06)',
                },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '16px', borderRadius: 10, textAlign: 'center',
                  background: item.bg, border: '1px solid rgba(0,0,0,0.06)',
                }}>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: item.color }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fraud Risk Progress */}
          {selectedTicket?.fraudRisk != null && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Fraud Risk Score</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: selectedTicket.fraudRisk > 0.5 ? '#ef4444' : '#10b981' }}>
                  {(selectedTicket.fraudRisk * 100).toFixed(1)}%
                </span>
              </div>
              <div className="crm-progress-bar">
                <div
                  className="crm-progress-fill"
                  style={{
                    width: `${selectedTicket.fraudRisk * 100}%`,
                    background: selectedTicket.fraudRisk > 0.5
                      ? 'linear-gradient(90deg, #ef4444, #f97316)'
                      : 'linear-gradient(90deg, #10b981, #34d399)',
                  }}
                />
              </div>
            </div>
          )}

          {/* AI Draft */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Agentic Auto-Draft Response
            </div>
            <div className="crm-ai-panel">
              <div className="crm-ai-label" style={{ color: '#1c39bb' }}>
                RAG-Powered Response Draft
              </div>
              <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.65 }}>
                {selectedTicket?.aiSuggestedResponse || 'No response generated yet.'}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
          <Button size="small" onClick={() => setSelectedTicket(null)} sx={{ color: '#64748b' }}>
            Close
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setSelectedTicket(null)}
          >
            ✓ Approve & Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IntelligentQueue;

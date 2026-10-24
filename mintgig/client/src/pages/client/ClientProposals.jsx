import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { TextArea } from '../../components/common/Input';
import api from '../../api/client';
import { FileText, ExternalLink, MessageSquare, Check, X, ShieldCheck } from 'lucide-react';

export const ClientProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decision Modal
  const [activeDecision, setActiveDecision] = useState(null); // { proposal, type: 'accepted'|'rejected' }
  const [clientNote, setClientNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProposals = async () => {
    try {
      const res = await api.get('/projects/client/all-proposals');
      if (res.success) setProposals(res.data.proposals || []);
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const openDecisionModal = (proposal, type) => {
    setActiveDecision({ proposal, type });
    setClientNote(
      type === 'accepted'
        ? 'Great portfolio and verified credentials. Excited to collaborate on this project!'
        : 'Thank you for your proposal. We have selected another candidate for this specific scope.'
    );
  };

  const submitDecision = async () => {
    if (!activeDecision) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/projects/proposals/${activeDecision.proposal._id}/decide`, {
        decision: activeDecision.type,
        clientNote,
      });

      if (res.success) {
        setActiveDecision(null);
        await fetchProposals();
      }
    } catch (err) {
      alert(err.message || 'Decision failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Received Proposals">
      <div className="space-y-6">
        <p className="text-xs text-brand-muted">
          Review incoming student proposals, inspect their automatically verified credentials, and make decisions.
        </p>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brand-muted">Loading received proposals...</p>
          </div>
        ) : proposals.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto">
            <FileText className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-brand-dark">No proposals received yet</h3>
            <p className="text-xs text-brand-muted mt-1">
              Student proposals will appear here as soon as candidates apply to your project listings.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {proposals.map((p) => (
              <Card key={p._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-brand-accentLight text-brand-dark font-bold text-xs flex items-center justify-center border border-brand/20">
                        {p.student?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-brand-dark">{p.student?.name}</h4>
                          <Badge
                            variant={
                              p.status === 'accepted'
                                ? 'emerald'
                                : p.status === 'rejected'
                                ? 'rose'
                                : 'blue'
                            }
                          >
                            {p.status.toUpperCase()}
                          </Badge>
                        </div>
                        {p.student?.username && (
                          <Link
                            to={`/portfolio/${p.student.username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-brand font-semibold hover:underline inline-flex items-center mt-0.5"
                          >
                            <span>Inspect Student Portfolio</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-brand-muted">
                      Applied for project: <strong className="text-brand-dark">{p.project?.title}</strong>
                    </div>

                    <div className="p-4 rounded-xl bg-brand-bg border border-brand-border text-xs leading-relaxed">
                      <span className="font-semibold text-brand-dark block mb-1">Cover Message:</span>
                      <p className="text-brand-text whitespace-pre-line">{p.coverMessage}</p>
                    </div>

                    {p.clientNote && (
                      <p className="text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                        <strong>Your Decision Note:</strong> {p.clientNote}
                      </p>
                    )}
                  </div>

                  {/* Financial Details and Action Buttons */}
                  <div className="flex flex-col md:items-end justify-between min-w-[200px] pt-4 md:pt-0 border-t md:border-t-0 border-brand-border space-y-4">
                    <div className="md:text-right">
                      <p className="text-lg font-extrabold text-brand-dark">
                        ₹{p.proposedBudget?.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-brand-muted">
                        Delivery in {p.estimatedDays} Days
                      </p>
                    </div>

                    {p.status === 'pending' ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50 border-rose-200"
                          onClick={() => openDecisionModal(p, 'rejected')}
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          <span>Reject</span>
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openDecisionModal(p, 'accepted')}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          <span>Accept</span>
                        </Button>
                      </div>
                    ) : p.status === 'accepted' ? (
                      <Link to="/client/messages">
                        <Button variant="primary" size="sm" className="flex items-center space-x-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat with Freelancer</span>
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Decision Modal */}
      <Modal
        isOpen={!!activeDecision}
        onClose={() => setActiveDecision(null)}
        title={activeDecision?.type === 'accepted' ? 'Accept Proposal' : 'Reject Proposal'}
      >
        <div className="space-y-4">
          <p className="text-xs text-brand-muted">
            {activeDecision?.type === 'accepted'
              ? `You are accepting ${activeDecision.proposal.student?.name}'s proposal for ₹${activeDecision.proposal.proposedBudget?.toLocaleString()}. The project will transition to In Progress and project messaging will open.`
              : `Notify ${activeDecision?.proposal.student?.name} that their proposal was not selected for this project.`}
          </p>

          <TextArea
            label="Decision Note to Candidate"
            rows={3}
            value={clientNote}
            onChange={(e) => setClientNote(e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-3 border-t border-brand-border">
            <Button variant="outline" size="sm" onClick={() => setActiveDecision(null)}>
              Cancel
            </Button>
            <Button
              variant={activeDecision?.type === 'accepted' ? 'primary' : 'danger'}
              size="sm"
              loading={submitting}
              onClick={submitDecision}
            >
              Confirm {activeDecision?.type === 'accepted' ? 'Acceptance' : 'Rejection'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ClientProposals;

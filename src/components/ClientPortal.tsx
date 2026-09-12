'use client';

import React, { useState, useEffect } from 'react';
import { PortalProject, FeedbackItem, ChangeRequest, PendingClientItem, RouteType } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { usePortal } from '../context/PortalContext';
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  Send, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  Download, 
  Plus, 
  MessageSquare, 
  CreditCard, 
  Terminal, 
  Activity,
  ArrowRight,
  Sparkles,
  Upload,
  Eye,
  Check,
  RefreshCw,
  LogOut
} from 'lucide-react';

interface ClientPortalProps {
  project: PortalProject;
  onLogout: () => void;
  onNavigate: (route: RouteType) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ project, onLogout, onNavigate }) => {
  const { formatAmount, currency } = useCurrency();
  const { sendMessage, approveMilestone, getMessages } = usePortal();
  const [activeTab, setActiveTab] = useState<'overview' | 'staging' | 'feedback' | 'files' | 'changes' | 'messages' | 'retainer'>('overview');

  // Feedback Form State
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(project.feedbackItems);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    page: '',
    section: '',
    currentBehavior: '',
    requestedChange: '',
    priority: 'medium' as FeedbackItem['priority']
  });

  // Change Request State
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(project.changeRequests);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [newChange, setNewChange] = useState({
    title: '',
    description: '',
  });

  // Messages State
  const [messages, setMessages] = useState(project.messages);
  const [newMessageText, setNewMessageText] = useState('');

  // Fetch the real message thread (client + studio replies) from the worker.
  useEffect(() => {
    let active = true;
    getMessages(project.id).then((thread) => {
      if (active) setMessages(thread);
    });
    return () => {
      active = false;
    };
  }, [project.id, getMessages]);

  // Pending Items State
  const [pendingItems, setPendingItems] = useState<PendingClientItem[]>(project.pendingItems);
  const [uploadModalItem, setUploadModalItem] = useState<PendingClientItem | null>(null);

  // Payment Milestone Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentState, setPaymentState] = useState(project.payment);

  const PROCESS_STEPS = [
    'First Contact',
    'Qualification',
    'Proposal',
    'Kickoff',
    'Discovery',
    'UI/UX Design',
    'Engineering',
    'QA & Audit',
    'Final Review',
    'Launch',
    'Warranty',
  ];
  const totalSteps = project.totalSteps ?? 11;
  const currentStep = Math.max(0, Math.min(project.step ?? 0, totalSteps - 1));
  const progressPct = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Submit Feedback Handler
  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.page || !newFeedback.requestedChange) return;

    const created: FeedbackItem = {
      id: `fb-${Date.now().toString().slice(-4)}`,
      page: newFeedback.page,
      section: newFeedback.section || 'General',
      currentBehavior: newFeedback.currentBehavior || 'As currently implemented',
      requestedChange: newFeedback.requestedChange,
      priority: newFeedback.priority,
      status: 'under_review',
      submittedAt: 'Just now'
    };

    setFeedbackList([created, ...feedbackList]);
    setNewFeedback({ page: '', section: '', currentBehavior: '', requestedChange: '', priority: 'medium' });
    setFeedbackModalOpen(false);
  };

  // Submit Change Request Handler
  const handleAddChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChange.title || !newChange.description) return;

    const created: ChangeRequest = {
      id: `cr-${Date.now().toString().slice(-4)}`,
      title: newChange.title,
      description: newChange.description,
      impactHours: 12,
      addedCost: 1600,
      status: 'requested',
      submittedAt: 'Just now'
    };

    setChangeRequests([created, ...changeRequests]);
    setNewChange({ title: '', description: '' });
    setChangeModalOpen(false);
  };

  // Send Message Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const msg = {
      id: `msg-${Date.now()}`,
      sender: 'client' as const,
      text: newMessageText,
      timestamp: 'Just now'
    };

    setMessages([...messages, msg]);
    setNewMessageText('');

    // Push the message upstream so it syncs into the CRM.
    sendMessage(project.id, msg.text);
  };

  // Resolve Pending Item
  const handleResolvePending = (itemId: string) => {
    setPendingItems(prev => 
      prev.map(item => item.id === itemId ? { ...item, status: 'submitted' } : item)
    );
    setUploadModalItem(null);
  };

  // Simulate Milestone Payment
  const handleProcessPayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentState(prev => ({
        ...prev,
        percentReceived: 100,
        amountPaid: prev.totalBudget,
        nextDueAmount: 0,
        nextDueCondition: 'All milestones fulfilled. Ready for final production handover.',
        milestones: prev.milestones.map(m => ({ ...m, status: 'paid' }))
      }));
      setPaymentModalOpen(false);
      setPaymentSuccess(false);
    }, 1200);
  };

  return (
    <div id="client-portal-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Project Scope Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden bg-muted/80">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-[#00D4FF] text-xs font-mono font-medium">
              Project #{project.id}
            </span>
            <span className="text-xs text-muted-foreground">
              Client: <strong className="text-foreground">{project.clientCompany}</strong> ({project.clientName})
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
            {project.name}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            {project.statusSummary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {project.stagingUrl && (
            <button
              onClick={() => setActiveTab('staging')}
              className="px-4 py-2.5 rounded-xl bg-[#00D4FF]/15 hover:bg-[#00D4FF]/25 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Staging</span>
            </button>
          )}

          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#ff5a34] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#FF6B4A]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Feedback</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-surface hover:bg-surface border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Sign out of portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 11-Step Process Tracker (synced from CRM) */}
      <div className="p-6 rounded-3xl glass-panel border border-border bg-surface">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#00D4FF]">
            11-Step Delivery Process
          </span>
          <span className="text-xs font-mono text-[#3DDC97]">
            Step {currentStep + 1} of {totalSteps} · {progressPct}%
          </span>
        </div>

        <div className="w-full bg-surface rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#6C63FF] to-[#3DDC97] h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PROCESS_STEPS.map((label, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div
                key={label}
                className={`shrink-0 min-w-[128px] p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-[#6C63FF]/20 border-[#00D4FF] shadow-lg shadow-[#6C63FF]/15'
                    : isCompleted
                    ? 'bg-surface border-[#3DDC97]/40 text-foreground'
                    : 'bg-surface border-border text-muted-foreground/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono text-[10px] opacity-75">{String(idx + 1).padStart(2, '0')}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC97]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-ping" />
                  ) : (
                    <Clock className="w-3 h-3 text-foreground/20" />
                  )}
                </div>
                <div className="font-display font-semibold text-xs text-foreground leading-tight">
                  {label}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {isCurrent ? 'In progress' : isCompleted ? 'Done' : 'Upcoming'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'staging', label: 'Live Staging Embed' },
          { id: 'feedback', label: `Structured Feedback (${feedbackList.length})` },
          { id: 'files', label: `Files & Contracts (${project.files.length})` },
          { id: 'changes', label: `Change Requests (${changeRequests.length})` },
          { id: 'messages', label: 'Direct Thread' },
          { id: 'retainer', label: 'Maintenance & Retainer' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-surface text-[#00D4FF] border border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* 3 Metric Cards: Current Status, Milestone, Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: What's Happening Now */}
            <div className="p-6 rounded-3xl glass-panel border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#00D4FF] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> What's Happening Now
                </span>
                <span className="w-2 h-2 rounded-full bg-[#3DDC97] animate-pulse" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {project.statusSummary}
              </p>
              <div className="pt-2 text-xs text-muted-foreground flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#6C63FF]" />
                <span>Synchronized from Studio Git CI/CD</span>
              </div>
            </div>

            {/* Card 2: Next Milestone */}
            <div className="p-6 rounded-3xl glass-panel border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#3DDC97] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Next Milestone
                </span>
                <span className="text-xs font-mono text-foreground bg-surface px-2 py-0.5 rounded">
                  {project.nextMilestoneDueDate}
                </span>
              </div>
              <div className="text-lg font-display font-bold text-foreground">
                {project.nextMilestone}
              </div>
              <p className="text-xs text-muted-foreground">
                Target review build will be pushed to your private staging endpoint before review call.
              </p>
            </div>

            {/* Card 3: Milestone Payment Status */}
            <div className="p-6 rounded-3xl glass-panel border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#FF6B4A] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Payment Status
                </span>
                <span className="text-xs font-mono font-bold text-[#3DDC97]">
                  {paymentState.percentReceived}% Received
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {formatAmount(paymentState.amountPaid)} / {formatAmount(paymentState.totalBudget)}
                </div>
                <div className="w-full bg-surface rounded-full h-2 mt-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#6C63FF] to-[#3DDC97] h-2 rounded-full" 
                    style={{ width: `${paymentState.percentReceived}%` }} 
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                  {paymentState.nextDueCondition}
                </span>
                {paymentState.nextDueAmount > 0 && (
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="text-xs font-semibold text-[#00D4FF] hover:underline shrink-0 ml-2"
                  >
                    Pay Milestone →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Milestones & Approvals (real, synced from CRM) */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-border space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#00D4FF]">
                Milestones & Approvals
              </span>
              <h3 className="text-lg font-display font-bold text-foreground mt-0.5">
                Review & sign off on deliverables
              </h3>
            </div>

            {(project.milestones ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No milestones have been synced from the studio yet.
              </p>
            ) : (
              <div className="space-y-3">
                {(project.milestones ?? []).map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{m.name}</span>
                        {m.status === 'done' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#3DDC97]/10 border border-[#3DDC97]/20 text-[#3DDC97]">
                            Approved
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                            Pending
                          </span>
                        )}
                      </div>
                      {m.due_date && (
                        <div className="text-[11px] text-muted-foreground">Due: {m.due_date}</div>
                      )}
                    </div>
                    {m.status !== 'done' && (
                      <button
                        onClick={() => approveMilestone(project.id, m.id, m.name)}
                        className="px-4 py-2 rounded-xl bg-[#3DDC97]/15 hover:bg-[#3DDC97]/25 border border-[#3DDC97]/30 text-[#3DDC97] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Items From Client */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#FF6B4A]">
                  Client Action Required
                </span>
                <h3 className="text-lg font-display font-bold text-foreground mt-0.5">
                  Pending items needed from your team
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {pendingItems.filter(i => i.status === 'pending').length} pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{item.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    {item.dueDate && (
                      <div className="text-[11px] text-[#00D4FF]">Target Date: {item.dueDate}</div>
                    )}
                  </div>

                  <div>
                    {item.status === 'pending' ? (
                      <button
                        onClick={() => setUploadModalItem(item)}
                        className="px-4 py-2 rounded-xl bg-[#00D4FF]/15 hover:bg-[#00D4FF]/25 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Fulfill</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#3DDC97] bg-[#3DDC97]/10 px-3 py-1.5 rounded-xl border border-[#3DDC97]/20">
                        <Check className="w-3.5 h-3.5" />
                        <span>Submitted for Review</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-border space-y-6">
            <h3 className="text-lg font-display font-bold text-foreground">
              Recent Project Activity
            </h3>
            <div className="space-y-4 border-l-2 border-border pl-6 ml-2">
              {project.activityLog.map((log) => (
                <div key={log.id} className="relative space-y-1">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#00D4FF] ring-4 ring-[#07080C]" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{log.title}</span>
                    <span className="text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{log.description}</p>
                  <div className="text-[10px] text-[#6C63FF] font-mono">By {log.author}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Staging Link / Live Preview Embed */}
      {activeTab === 'staging' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl glass-panel border border-border flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#3DDC97] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Staging Environment Active
              </span>
              <div className="text-sm font-mono text-foreground mt-1">
                {project.stagingUrl || 'https://staging-build.bitnexel.dev'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setFeedbackModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#FF6B4A] hover:bg-[#ff5a34] text-white text-xs font-semibold"
              >
                Log Feedback on this Screen
              </button>
            </div>
          </div>

          {/* Interactive Staging Frame Simulation */}
          <div className="rounded-3xl border border-border overflow-hidden bg-muted shadow-2xl">
            {/* Chrome Bar */}
            <div className="px-4 py-3 bg-muted border-b border-border flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 font-mono text-xs text-foreground">
                  {project.stagingUrl || 'https://staging-preview.bitnexel.dev'}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#3DDC97]/15 text-[#3DDC97] font-mono text-[10px]">
                Build v0.68-rc4 (Passing)
              </span>
            </div>

            {/* Simulated Live Product Screen */}
            <div className="p-8 sm:p-12 min-h-[450px] bg-gradient-to-b from-muted to-background text-left space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                  <div className="text-xs text-[#00D4FF] font-mono font-semibold uppercase">
                    Staging Release Candidate
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground mt-1">
                    {project.name} · Preview Instance
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-lg bg-surface border border-border text-xs text-muted-foreground">
                  Protected Sandboxed Viewport
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
                  <div className="text-xs text-muted-foreground">Simulated Active Users</div>
                  <div className="text-2xl font-bold font-mono text-foreground">1,280 Daily</div>
                  <div className="text-[11px] text-[#3DDC97]">+18% MoM retention</div>
                </div>
                <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
                  <div className="text-xs text-muted-foreground">Average API Latency</div>
                  <div className="text-2xl font-bold font-mono text-[#00D4FF]">142 ms</div>
                  <div className="text-[11px] text-muted-foreground">Sub-second edge caching</div>
                </div>
                <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
                  <div className="text-xs text-muted-foreground">WCAG Contrast Audit</div>
                  <div className="text-2xl font-bold font-mono text-[#3DDC97]">100% Passed</div>
                  <div className="text-[11px] text-muted-foreground">AA Accessible on dark/glass</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="text-sm font-semibold text-foreground">
                  Interactive Module Testing Guide:
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You are viewing the compiled deployment candidate. Test responsive navigation, modal interactions, and form inputs. Notice any adjustments? Use the "Submit Feedback" button above to log a structured item with screenshot context.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Structured Feedback (Replacing 50 WhatsApp messages) */}
      {activeTab === 'feedback' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#00D4FF]">
                Trackable Quality Assurance
              </span>
              <h3 className="text-2xl font-display font-bold text-foreground mt-1">
                Structured Feedback Log
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Pinpoint exact pages, sections, and priority levels. Eliminates missed WhatsApp messages.
              </p>
            </div>
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#FF6B4A] hover:bg-[#ff5a34] text-white text-xs font-semibold flex items-center gap-2 shrink-0 shadow-lg shadow-[#FF6B4A]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Feedback</span>
            </button>
          </div>

          <div className="space-y-4">
            {feedbackList.map((fb) => (
              <div 
                key={fb.id}
                className="p-6 rounded-2xl glass-panel border border-border space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#00D4FF] font-semibold">
                      {fb.page}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Section: <strong className="text-foreground">{fb.section}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded ${
                      fb.priority === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      fb.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-surface text-muted-foreground'
                    }`}>
                      {fb.priority} priority
                    </span>

                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded ${
                      fb.status === 'resolved' ? 'bg-[#3DDC97]/20 text-[#3DDC97]' :
                      fb.status === 'in_progress' ? 'bg-[#00D4FF]/20 text-[#00D4FF]' :
                      'bg-surface text-muted-foreground'
                    }`}>
                      {fb.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Current Observation:</span>
                    <p className="text-foreground mt-1">{fb.currentBehavior}</p>
                  </div>
                  <div>
                    <span className="text-[#00D4FF]">Requested Change:</span>
                    <p className="text-foreground font-medium mt-1">{fb.requestedChange}</p>
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground pt-1 flex items-center justify-between">
                  <span>Logged {fb.submittedAt}</span>
                  {fb.status === 'resolved' && (
                    <span className="text-[#3DDC97] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Deployed to staging
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Files & Contracts */}
      {activeTab === 'files' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl glass-panel border border-border">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#00D4FF]">
              Asset Vault
            </span>
            <h3 className="text-xl font-display font-bold text-foreground mt-1">
              Document Center & Handover Packages
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Every SOW, executed NDA, architecture diagram, and invoice stored permanently for your records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.files.map((file) => (
              <div 
                key={file.id}
                className="p-5 rounded-2xl glass-panel border border-border flex items-center justify-between group hover:border-[#6C63FF]/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-surface border border-border text-[#00D4FF] group-hover:bg-[#6C63FF] group-hover:text-foreground transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-[#00D4FF] transition-colors line-clamp-1">
                      {file.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.category}</span>
                      <span>•</span>
                      <span>{file.date}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Simulating download for ${file.name}`)}
                  className="p-2 rounded-xl bg-surface hover:bg-surface text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Change Requests */}
      {activeTab === 'changes' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#3DDC97]">
                Scope Governance
              </span>
              <h3 className="text-2xl font-display font-bold text-foreground mt-1">
                Change Request Pipeline
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Pipeline: Requested → Reviewed → Quoted → Approved → In Progress → Done. Transparent hour impact & cost.
              </p>
            </div>
            <button
              onClick={() => setChangeModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#00D4FF] hover:bg-[#3be0ff] text-[#07080C] font-semibold text-xs flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Request Scope Addition</span>
            </button>
          </div>

          <div className="space-y-4">
            {changeRequests.map((cr) => (
              <div 
                key={cr.id}
                className="p-6 rounded-2xl glass-panel border border-border space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      CR #{cr.id}
                    </span>
                    <h4 className="font-bold text-base text-foreground">
                      {cr.title}
                    </h4>
                  </div>

                  <span className="text-xs font-mono uppercase px-3 py-1 rounded bg-[#6C63FF]/20 text-[#00D4FF]">
                    Status: {cr.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {cr.description}
                </p>

                <div className="p-4 rounded-xl bg-surface border border-border flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-muted-foreground">Engineering Impact:</span>
                      <div className="font-mono font-bold text-foreground mt-0.5">{cr.impactHours} sprint hours</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Transparent Surcharge:</span>
                      <div className="font-mono font-bold text-[#3DDC97] mt-0.5">+{formatAmount(cr.addedCost)}</div>
                    </div>
                  </div>

                  {cr.status === 'quoted' && (
                    <button 
                      onClick={() => {
                        setChangeRequests(prev => prev.map(item => item.id === cr.id ? { ...item, status: 'approved' } : item));
                      }}
                      className="px-4 py-2 rounded-xl bg-[#3DDC97] hover:bg-[#34c485] text-black text-xs font-semibold"
                    >
                      Approve Quote into Sprint →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Direct Messages */}
      {activeTab === 'messages' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-border space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">
                Direct Studio Thread
              </h3>
              <p className="text-xs text-muted-foreground">
                For asynchronous announcements and check-ins. (Primary technical feedback is tracked in the Feedback tab).
              </p>
            </div>
            <div className="text-xs text-[#3DDC97] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#3DDC97] animate-pulse" />
              <span>We reply within 1 business day</span>
            </div>
          </div>

          {/* Message Stream */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-lg p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'client' 
                    ? 'bg-[#6C63FF] text-foreground rounded-br-none' 
                    : 'bg-surface text-foreground border border-border rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {msg.sender === 'client' ? 'You' : 'Bitnexel Studio'} · {msg.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} className="flex gap-3 pt-2">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Send message to lead architect..."
              className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#00D4FF] hover:bg-[#3be0ff] text-[#07080C] font-semibold text-sm flex items-center gap-2"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Retainer & Post-Launch Support */}
      {activeTab === 'retainer' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#3DDC97]">
                Post-Launch Assurance
              </span>
              <h3 className="text-2xl font-display font-bold text-foreground mt-1">
                Maintenance & Production Retainer
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Active Tier: <strong className="text-[#00D4FF]">{project.retainerPlan?.tier || 'Growth'} Plan</strong> · Continues post-launch so your software never degrades.
              </p>
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-4 py-2.5 rounded-xl bg-surface hover:bg-surface text-xs font-semibold text-foreground border border-border"
            >
              Compare Retainer Tiers
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-border space-y-2">
              <div className="text-xs text-muted-foreground">Uptime Reliability</div>
              <div className="text-2xl font-bold font-mono text-[#3DDC97]">
                {project.retainerPlan?.uptime || '99.99%'}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Continuous synthetic ping monitoring every 60 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-border space-y-2">
              <div className="text-xs text-muted-foreground">Automated Backups</div>
              <div className="text-base font-semibold text-foreground mt-1">
                {project.retainerPlan?.lastBackup || 'Daily Automated'}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Offsite encrypted snapshot retention (30 days).
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-border space-y-2">
              <div className="text-xs text-muted-foreground">SLA Response Window</div>
              <div className="text-base font-semibold text-[#00D4FF] mt-1">
                {project.retainerPlan?.responseGuarantee || '< 2 Hours Priority'}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Founder escalation for critical incident triage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-lg w-full p-8 rounded-3xl glass-panel bg-muted border border-border shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-display font-bold text-foreground">
                Submit Structured Feedback
              </h3>
              <button 
                onClick={() => setFeedbackModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFeedback} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Target Page / URL *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /investor/dashboard"
                  value={newFeedback.page}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, page: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Section / Component Name</label>
                <input
                  type="text"
                  placeholder="e.g. Capital Call Table or Mobile Navigation"
                  value={newFeedback.section}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, section: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Current Observation</label>
                <input
                  type="text"
                  placeholder="e.g. Numbers wrap to 2 lines on iPad viewport"
                  value={newFeedback.currentBehavior}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, currentBehavior: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Requested Change *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Format with standard currency abbreviations (e.g. $1.2M) and keep on one line"
                  value={newFeedback.requestedChange}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, requestedChange: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Priority</label>
                <select
                  value={newFeedback.priority}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                >
                  <option value="low">Low — Aesthetic Polish</option>
                  <option value="medium">Medium — Quality Improvement</option>
                  <option value="high">High — Milestone Blocker</option>
                  <option value="critical">Critical — Defect / Broken Flow</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#ff5a34] text-white font-semibold"
                >
                  Submit Item to Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE REQUEST MODAL */}
      {changeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-lg w-full p-8 rounded-3xl glass-panel bg-muted border border-border shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-display font-bold text-foreground">
                Request Scope Expansion
              </h3>
              <button 
                onClick={() => setChangeModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddChangeRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Feature / System Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add Multi-Currency Ledger Support"
                  value={newChange.title}
                  onChange={(e) => setNewChange(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Detailed Functional Requirements *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe what functionality needs to be added, who will use it, and what data it involves..."
                  value={newChange.description}
                  onChange={(e) => setNewChange(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <p className="text-[11px] text-muted-foreground">
                Bitnexel will review the architectural impact and quote sprint hours transparently before any work begins.
              </p>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setChangeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00D4FF] hover:bg-[#3be0ff] text-black font-semibold"
                >
                  Submit for Architectural Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD ITEM MODAL */}
      {uploadModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full p-8 rounded-3xl glass-panel bg-muted border border-border shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">
                Fulfill Pending Item
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {uploadModalItem.title}
              </p>
            </div>

            <div className="p-8 rounded-2xl border-2 border-dashed border-border text-center space-y-3 bg-surface">
              <Upload className="w-8 h-8 text-[#00D4FF] mx-auto" />
              <div className="text-xs text-foreground font-medium">
                Drag & drop files or credentials here
              </div>
              <div className="text-[10px] text-muted-foreground">
                Accepts PDF, PNG, JPG, ZIP, or JSON API keys
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUploadModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolvePending(uploadModalItem.id)}
                className="px-5 py-2.5 rounded-xl bg-[#3DDC97] hover:bg-[#34c485] text-black text-xs font-semibold"
              >
                Mark as Uploaded & Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAY MILESTONE MODAL */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full p-8 rounded-3xl glass-panel bg-muted border border-border shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-display font-bold text-foreground">
                  Process Milestone Payment
                </h3>
                <span className="text-xs text-muted-foreground">
                  Secure Studio Escrow
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#00D4FF]">
                {formatAmount(paymentState.nextDueAmount)}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Milestone Stage:</span>
                  <span className="text-foreground font-semibold">Final Review & Production Handover</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment Percentage:</span>
                  <span className="text-foreground font-semibold">30% Final Balance</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Warranty Trigger:</span>
                  <span className="text-[#3DDC97] font-semibold">Activates 30-Day Support SLA</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border text-center font-mono text-xs text-muted-foreground">
                Simulated Gateway (Stripe / Bank Wire / ACH)
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                className="px-6 py-2.5 rounded-xl bg-[#3DDC97] hover:bg-[#34c485] text-black text-xs font-semibold"
              >
                {paymentSuccess ? 'Milestone Paid!' : `Authorize ${formatAmount(paymentState.nextDueAmount)} Milestone`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

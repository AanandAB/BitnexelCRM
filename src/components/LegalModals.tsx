'use client';

import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | 'sitemap';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 rounded-3xl glass-panel bg-muted border border-border shadow-2xl space-y-6 text-left">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00D4FF]" />
            <h3 className="text-xl font-display font-bold text-foreground">
              {type === 'terms' && 'Master Terms of Service & SOW Governance'}
              {type === 'privacy' && 'Privacy Policy & Data Protection'}
              {type === 'sitemap' && 'XML Sitemap & Search Architecture'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'terms' && (
          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              <strong>1. Intellectual Property Ownership:</strong> Upon full and final settlement of all agreed project milestones (including the 20% final release balance), Bitnexel unconditionally transfers 100% of all copyright, source code, database architecture, and design assets to the client.
            </p>
            <p>
              <strong>2. 30-Day Bug Warranty:</strong> Bitnexel provides an unconditional 30-day post-launch warranty covering any technical bugs, browser discrepancies, or regressions from the approved Scope of Work (SOW).
            </p>
            <p>
              <strong>3. Scope Governance & Change Requests:</strong> Features outside the signed SOW will be transparently estimated in sprint hours and billed only after explicit written or portal approval from the client.
            </p>
            <p>
              <strong>4. Milestone Payments:</strong> Invoices are structured strictly on the 50/30/20 milestone schedule unless otherwise specified in an enterprise custom addendum.
            </p>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              <strong>Zero Data Brokering:</strong> Bitnexel does not sell, broker, or monetize client or lead data. All contact briefs submitted through our website or Client Portal are strictly used to coordinate technical execution.
            </p>
            <p>
              <strong>Infrastructure:</strong> We deploy on enterprise-grade Cloudflare Edge infrastructure. All data in transit is encrypted using TLS 1.3, and all stored records leverage AES-256 encryption.
            </p>
            <p>
              <strong>Non-Disclosure:</strong> We maintain strict client confidentiality. Project case studies are published only with explicit mutual authorization.
            </p>
          </div>
        )}

        {type === 'sitemap' && (
          <div className="space-y-3 font-mono text-xs text-foreground bg-muted p-4 rounded-2xl border border-border overflow-x-auto">
            <div className="text-[#00D4FF]">// Dynamic XML Sitemap Index</div>
            <div>https://bitnexel.com/</div>
            <div>https://bitnexel.com/services</div>
            <div>https://bitnexel.com/services/website</div>
            <div>https://bitnexel.com/services/software</div>
            <div>https://bitnexel.com/services/web-app</div>
            <div>https://bitnexel.com/work</div>
            <div>https://bitnexel.com/process</div>
            <div>https://bitnexel.com/pricing</div>
            <div>https://bitnexel.com/about</div>
            <div>https://bitnexel.com/contact</div>
            <div>https://bitnexel.com/start</div>
            <div>https://bitnexel.com/portal</div>
          </div>
        )}

        <div className="pt-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface hover:bg-surface text-xs text-foreground font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Rocket, Copy, Check, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';

interface VercelDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployGuideModal: React.FC<VercelDeployGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm border border-slate-700">
              ▲
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Deploy to Vercel</h3>
              <p className="text-xs text-slate-400">Zero-Config Hosting for AccelerateFresh LMS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status Note */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-200">Repository Pre-Configured for Vercel:</strong>
              We have already created a pre-configured <code className="bg-emerald-950 text-emerald-200 px-1 py-0.5 rounded font-mono">vercel.json</code> in your project root with client-side SPA rewrites and Vite build settings!
            </div>
          </div>

          {/* Option A: Vercel CLI (Fastest - 1 Minute) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Method 1: Deploy with Vercel CLI</span>
              </h4>
              <span className="text-[11px] text-indigo-400 font-semibold">Recommended</span>
            </div>

            <p className="text-xs text-slate-400">
              Run these commands in your local project terminal:
            </p>

            <div className="space-y-2">
              {[
                { label: '1. Install Vercel CLI globally', cmd: 'npm i -g vercel' },
                { label: '2. Deploy project to Vercel', cmd: 'vercel' },
                { label: '3. Deploy directly to production', cmd: 'vercel --prod' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono"
                >
                  <span className="text-slate-300 truncate">{step.cmd}</span>
                  <button
                    onClick={() => copyToClipboard(step.cmd, idx)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 shrink-0 ml-2"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Option B: Git Push to GitHub & Import in Vercel UI */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white">
              Method 2: Import via Vercel Dashboard
            </h4>
            <ol className="space-y-2 text-xs text-slate-300 pl-4 list-decimal leading-relaxed">
              <li>Push this project to your GitHub, GitLab, or Bitbucket repository.</li>
              <li>Open <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">vercel.com/new <ExternalLink className="w-3 h-3" /></a> and click "Import Project".</li>
              <li>Vercel automatically detects the <strong className="text-white">Vite</strong> framework and applies <code className="text-indigo-300">npm run build</code>.</li>
              <li>Add the environment variable <code className="text-indigo-300">GEMINI_API_KEY</code> under "Environment Variables" for live AI features.</li>
              <li>Click <strong className="text-white">Deploy</strong>. Your LMS is live globally in 30 seconds!</li>
            </ol>
          </div>

          {/* Environment Variables Note */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-slate-300">Vercel Environment Variables:</span>
            <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-indigo-300">
              GEMINI_API_KEY = "your_gemini_api_key_here"
            </div>
            <p className="text-slate-400 text-[11px]">
              Note: Even without an API key, the LMS includes built-in high-fidelity intelligent heuristics and Python executors so students never experience broken features!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};

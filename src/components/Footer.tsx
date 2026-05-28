import React from 'react';
import { ShieldCheck, Heart, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span className="font-sans font-bold text-lg text-white tracking-tight">MedVerify</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Securing global medicine delivery corridors by providing instant verification checkpoints. Track serial anomalies and verify expiry parameters securely.
            </p>
          </div>

          <div>
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">Verification Hubs</span>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <span className="hover:text-teal-400 cursor-pointer block">QR Registry Codes</span>
              </li>
              <li>
                <span className="hover:text-teal-400 cursor-pointer block">Regional Distributors Check</span>
              </li>
              <li>
                <span className="hover:text-teal-400 cursor-pointer block">Consumer Safety Portal</span>
              </li>
              <li>
                <span className="hover:text-teal-400 cursor-pointer block">Suspected Drug Recalls</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">Legal & Compliance</span>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <span className="hover:text-teal-400 cursor-pointer block">FDA Regulations Standard</span>
              </li>
              <li>
                <span className="hover:text-teal-400 cursor-pointer block">GMP Certificate Loggers</span>
              </li>
              <li>
                <span className="hover:text-teal-400 cursor-pointer block">Terms of Deployment</span>
              </li>
              <li>
                <span className="hover:text-teal-400 cursor-pointer block">Pharmacy Privacy Guidelines</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">Quick Support Contact</span>
            <div className="mt-4 space-y-3 text-xs">
              <p className="text-slate-400">
                Are you a certified manufacturer looking to securely integrate batch serial QR stamps?
              </p>
              <div className="flex items-center space-x-2 text-teal-400 font-medium">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@medverify.com" className="hover:underline">support@medverify.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MedVerify Global. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0 space-x-1">
            <span>Powered by</span>
            <span className="text-teal-400 font-semibold">Gemini 3.5 AI Core</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

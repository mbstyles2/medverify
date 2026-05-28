import React from 'react';
import { Award, ShieldAlert, Heart, Landmark, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16 text-left" id="about-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4 text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Protecting Patient Health</span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight sm:text-4xl">
            About MedVerify Compliance Platform
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto text-center font-medium">
            MedVerify is an advanced drug authenticity scanner and anti-counterfeiting tracking network bridging patients, pharmacies, and global medical manufacturers.
          </p>
        </div>

        {/* Corporate philosophy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <Landmark className="h-5 w-5 text-blue-600" />
            <span>The Counterfeit Medicine Crisis</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            According to global health estimations, over 10% of medications distributed across developing nations are either counterfeit, poorly manufactured, or diluted. Falsified pharmaceuticals cause critical medical failures and result in thousands of preventable fatalities annually. MedVerify responds directly by supplying an instantaneous validation protocol.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            By assigning unique randomized alphanumeric serial keys to unit containers coupled with real-time replication log tracking, we make counterfeit replication nearly impossible.
          </p>
        </div>

        {/* Core pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl inline-block border border-emerald-100">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">100% Secure Serialization</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-bold">
              Every package is stamped with a UUID serial key tracked by our Relational SQLite registry database. Once checked, subsequent scans are monitored to flag replay piracy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl inline-block border border-blue-100">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Regional Outlier Auditing</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-bold">
              Monitors spatial parameters during scan validation to identify regional outliers. Flagged anomalies alert compliance managers immediately.
            </p>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800">
            Professional Safety Notice
          </h3>
          <p className="text-xs text-blue-900 leading-relaxed font-medium">
            While MedVerify employs complex anti-cloning and database serialization analytics, it should always be used alongside standard physical inspection checks (seal verification, print packaging audit). If a drug makes you feel uneasy, please report it immediately and contact professional healthcare supervisors.
          </p>
        </div>
      </div>
    </div>
  );
};

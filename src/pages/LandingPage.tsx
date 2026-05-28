import React from 'react';
import { ShieldCheck, Activity, SearchCode, AlertTriangle, ArrowRight, UserCheck, ShieldAlert, Award } from 'lucide-react';

interface LandingPageProps {
  setView: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50" id="landing-page-container">
      {/* Hero Presentation */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[10px]">Active Drug Registry Enabled</span>
              </div>
              
              <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-800 tracking-tight leading-[1.1] text-balance">
                Real-Time <span className="text-blue-600">Medicine</span> Authenticity Verification.
              </h1>
              
              <p className="font-sans text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed text-balance font-medium">
                Protect yourself and your pharmacy from suspicious counterfeit drugs. Scan unique, blockchain-secure batch series labels, crosscheck manufacturer expiry dates, and analyze cloned drug replay risks in 2 seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => setView('scan')}
                  className="w-full sm:w-auto flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-xs cursor-pointer group transition-all"
                >
                  <SearchCode className="h-5 w-5" />
                  <span>Scan Medicine QR</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setView('auth')}
                  className="w-full sm:w-auto flex justify-center items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold py-3.5 px-6 rounded-xl cursor-pointer transition-all"
                >
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <span>Register Pharmacy Portal</span>
                </button>
              </div>

              {/* Instant Trust Anchors */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                <div className="text-left">
                  <span className="block text-2xl font-bold text-slate-800 leading-none">100%</span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">GMP Certified</span>
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-bold text-slate-800 leading-none">2s</span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Validation Time</span>
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-bold text-slate-800 leading-none">Anti-Cloning</span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Replay System</span>
                </div>
              </div>
            </div>

            {/* Right Graphics/Mockup Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
                <div className="absolute -top-4 -right-4 bg-emerald-600 text-white p-2.5 rounded-xl shadow-sm flex items-center space-x-1 font-mono text-xs font-bold leading-none pointer-events-none">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verified Safe</span>
                </div>
                
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 text-left">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">Amoxicillin Premium</h3>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest leading-none">Batch AMX-120</span>
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  {/* Visual Timeline details */}
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Origin Manufacturer</span>
                    <span className="font-bold text-slate-800">BioPharma Global</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Assigned Expiry</span>
                    <span className="font-bold text-emerald-600">November 2028</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Scan Status Count</span>
                    <span className="font-bold text-slate-850 font-mono">1st scan (Genuine)</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-left">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    "This drug serialization QR scan satisfies standard regional healthcare validation compliance indicators."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" Sequence section */}
      <section className="py-20 bg-slate-50" id="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Interactive Workflow</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl text-balance">
              Three Steps to Secure Your Pharmacy Corridors
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto text-balance font-medium">
              Simple steps designed for doctors, pharmacists, and consumers alike to authenticate medicines on spot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-center">
              <span className="mx-auto flex justify-center items-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-mono font-extrabold text-lg border border-blue-100">1</span>
              <h3 className="text-base font-bold text-slate-800">Find Registry Code</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-4 text-balance font-medium">
                Locate the MedVerify thermal-sealed QR code or alphanumeric print printed clearly on the outer carton seals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-center">
              <span className="mx-auto flex justify-center items-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-mono font-extrabold text-lg border border-blue-100">2</span>
              <h3 className="text-base font-bold text-slate-800">Scan QR Code Box</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-4 text-balance font-medium">
                Click "Scan Verification", switch on your phone or webcam, or manually type the code underneath to fetch credentials.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-center">
              <span className="mx-auto flex justify-center items-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-mono font-extrabold text-lg border border-blue-100">3</span>
              <h3 className="text-base font-bold text-slate-800">Read Authenticity Status</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-4 text-balance font-medium">
                Our verification system flags duplicate cloned codes, expired batches, recalls and outputs instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features Bento Grid */}
      <section className="py-20 bg-white border-t border-b border-slate-200" id="features-bento-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Platform Security</span>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-balance">
              Extensive Defensive Fraud Countermeasures
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto text-balance font-medium">
              Countering modern pharmaceutical counterfeiting pipelines using smart serialization tracking rule engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs text-left space-y-4">
              <span className="p-3 bg-blue-50 text-blue-600 rounded-xl inline-block border border-blue-100">
                <ShieldAlert className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-base text-slate-800">Cloned Replay Protection</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                If criminals photocopy genuine packaging QR codes, our system flags duplicate rapid coordinates scans and marks the code as highly suspicious.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs text-left space-y-4">
              <span className="p-3 bg-blue-50 text-blue-600 rounded-xl inline-block border border-blue-100">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-base text-slate-800">Expiry Validation Checks</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Automatically checks current server calendar clocks against manufacturer-registered batch expuries to safeguard consumers on-the-spot.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs text-left space-y-4">
              <span className="p-3 bg-blue-50 text-blue-600 rounded-xl inline-block border border-blue-100">
                <Award className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-base text-slate-800">Regulatory Compliance Recall</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Registered manufacturers can recall defective batch IDs immediately. Once recalled, any scanning of those serial logs notifies the user instantaneously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prompt CTA Support */}
      <section className="py-20 bg-slate-100 border-b border-slate-200 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">
            Protect Patient Health Corridor Delivery Routes Now.
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
            Create an administrator, pharmacy, or manufacturer account to easily upload batch sheets, export serialized printable code logs, and investigate suspicious fake submissions.
          </p>
          <div className="inline-flex gap-4 pt-2">
            <button
              onClick={() => setView('scan')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
            >
              Start Verifying Drugs
            </button>
            <button
              onClick={() => setView('auth')}
              className="bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-6 rounded-xl text-sm border border-slate-200 transition-all cursor-pointer shadow-xs"
            >
              Portal Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

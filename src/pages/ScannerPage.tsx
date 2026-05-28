import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { QrScannerComponent } from '../components/QrScannerComponent';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Lock,
  Calendar,
  Layers,
  Activity,
  UserCheck,
  BrainCircuit,
  FileCheck2,
} from 'lucide-react';
import { VerificationResult } from '../types';

export const ScannerPage: React.FC = () => {
  const { token } = useAuth();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Gemini specific states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleScanSuccess = async (decodedText: string) => {
    setScannedCode(decodedText);
    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    setAiResponse(null);

    try {
      // Direct call to scan verify endpoint
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/scan/verify', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: decodedText,
          location: 'Main Medical Center Scan Portal',
        }),
      });

      if (!response.ok) {
        throw new Error('Verification pipeline connection issue.');
      }

      const data = await response.json();
      setResult(data);
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred during scanning.');
    } finally {
      setLoading(false);
    }
  };

  const askAiAdvisory = async () => {
    if (!result || !result.medicine) return;
    setAiLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineName: result.medicine,
          dosage: result.dosage || 'Standard Spec',
          status: result.status,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.explanation);
      } else {
        setAiResponse('Information retrieval temporarily offline.');
      }
    } catch {
      setAiResponse('AI service failed to respond.');
    } finally {
      setAiLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedCode(null);
    setResult(null);
    setErrorMsg(null);
    setAiResponse(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 text-left" id="scanner-view-root">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Interactive Checkpoint</span>
          <h1 className="text-3xl font-extrabold text-slate-850 tracking-tight sm:text-4xl">
            Medicine Authenticity Verification
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto text-center font-medium">
            Position a certified MedVerify QR code in front of the lens or choose fallback manual tabs to query drug registries.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 leading-normal font-bold">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Main Action Block (Camera scanning OR validation view) */}
          <div className="md:col-span-12 lg:col-span-7 space-y-6">
            {!scannedCode ? (
              <QrScannerComponent onScanSuccess={handleScanSuccess} />
            ) : (
              // VERIFICATION LOGS / RESULTS CARD
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
                {/* Header state banner */}
                <div className={`p-6 text-white ${
                  loading
                    ? 'bg-slate-700'
                    : result?.status === 'Genuine'
                      ? 'bg-emerald-600'
                      : result?.status === 'Expired'
                        ? 'bg-amber-500'
                        : 'bg-rose-600'
                }`}>
                  <div className="flex justify-between items-center text-left">
                    <div>
                      <span className="text-[10px] font-mono leading-none font-bold uppercase tracking-wider opacity-80">
                        Scan code: {scannedCode}
                      </span>
                      <h3 className="text-lg font-extrabold tracking-tight mt-1 leading-none">
                        {loading
                          ? 'Checking Drug Registries...'
                          : result?.status === 'Genuine'
                            ? '✓ Authenticated Genuine'
                            : result?.status === 'Expired'
                              ? '⚠️ Expired Medication Warning'
                              : result?.status === 'Suspicious'
                                ? '⚠️ Suspicious Clone Warning'
                                : '❌ Unregistered Serial Code'}
                      </h3>
                    </div>
                    <div>
                      {result?.status === 'Genuine' ? (
                        <ShieldCheck className="h-10 w-10 text-emerald-100" />
                      ) : (
                        <AlertTriangle className="h-10 w-10 text-rose-100 animate-bounce" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {loading ? (
                    <div className="text-center py-10 space-y-2">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-slate-500 font-mono text-[11px]">Validating unique checksum serials...</p>
                    </div>
                  ) : (
                    result && (
                      <div className="space-y-6 text-left">
                        {/* Summary metrics grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border border-slate-200 p-3 rounded-xl bg-slate-50">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">Medicine</span>
                            <span className="block font-bold text-slate-800 text-sm mt-1 mb-0.5">{result.medicine}</span>
                            <span className="text-[10px] text-slate-500 leading-none block font-medium">{result.dosage}</span>
                          </div>

                          <div className="border border-slate-200 p-3 rounded-xl bg-slate-50">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">Manufacturer</span>
                            <span className="block font-bold text-slate-800 text-sm mt-1">{result.manufacturer}</span>
                          </div>

                          <div className="border border-slate-200 p-3 rounded-xl bg-slate-50">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">Batch & Expires</span>
                            <span className="block font-bold text-slate-800 text-sm mt-1">Lot: {result.batch}</span>
                            <span className="text-[10px] font-bold text-amber-600 block mt-0.5">Exp: {result.expiry}</span>
                          </div>

                          <div className="border border-slate-200 p-3 rounded-xl bg-slate-50">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">Replay Scan Counter</span>
                            <span className="block font-bold text-slate-800 text-sm mt-1">{result.scanHistoryCount} scan checks</span>
                          </div>
                        </div>

                        {/* Defended alert text */}
                        {result.warning && (
                          <div className={`p-4 rounded-xl border leading-normal ${
                            result.status === 'Expired'
                              ? 'bg-amber-50 border-amber-200 text-amber-900'
                              : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}>
                            <div className="flex gap-2 items-start">
                              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                              <p className="text-xs font-semibold">{result.warning}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-between items-center text-slate-500 text-[10px] border-t border-slate-200 mt-4 pt-4">
                          <span className="font-medium">Scan Logged at: {new Date(result.timestamp).toLocaleTimeString()}</span>
                          <button
                            onClick={resetScanner}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2.5 px-4 rounded-xl font-bold flex items-center space-x-1 transition-all cursor-pointer"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Scan Another package</span>
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Supportive Side Panel: Intelligent advisory details using Gemini */}
          <div className="md:col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
              <div className="inline-flex items-center space-x-1.5 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-xl text-[10px] font-bold border border-blue-500/20">
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>MedVerify AI Advisory Core</span>
              </div>
              
              <h3 className="font-sans font-extrabold text-base tracking-tight leading-tight">
                Get Clinical Safe Advisory Guidelines
              </h3>
              
              <p className="text-[11px] text-slate-400 leading-normal font-medium">
                Analyze medication components, search safe guidelines, storage parameters or read fake outcome safety hazard notices.
              </p>

              {result?.status ? (
                <div className="space-y-4 pt-2">
                  <button
                    onClick={askAiAdvisory}
                    disabled={aiLoading}
                    className="w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-xs hover:shadow-sm transition-all text-xs cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-white animate-pulse" />
                    <span>{aiLoading ? 'Interrogating clinical database...' : 'Consult Gemini AI Advisor'}</span>
                  </button>

                  {aiResponse && (
                    <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl max-h-[300px] overflow-y-auto text-xs leading-relaxed font-sans text-slate-300 text-left whitespace-pre-line shadow-inner">
                      {aiResponse}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-xl text-center flex flex-col items-center p-6 space-y-2">
                  <Lock className="h-8 w-8 text-blue-500/30" />
                  <p className="text-[10px] text-slate-500 font-medium">
                    Scan or insert a valid medicine code first to unlock the safety guidelines module.
                  </p>
                </div>
              )}
            </div>

            {/* Offline-Safety indicators */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs font-sans">
              <span className="font-mono font-bold text-blue-600 block uppercase tracking-widest text-[10px]">Registry Rules Key</span>
              <div className="space-y-3 font-medium">
                <div className="flex items-start space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <p className="text-[11px] text-slate-500"><strong className="text-slate-800">Genuine:</strong> Verified active checksum match directly issued by certified developers.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <p className="text-[11px] text-slate-500"><strong className="text-slate-800">Expired:</strong> Calendar clocks specify expired dates. Do not ingest under any condition.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                  <p className="text-[11px] text-slate-500"><strong className="text-slate-800">Suspicious replay:</strong> Unique serial detected multiple times previously. Counterfeit clone label hazard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

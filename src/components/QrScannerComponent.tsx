import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, Clipboard, UploadCloud, RefreshCw, AlertCircle, Copy, Check } from 'lucide-react';

interface QrScannerComponentProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
}

export const QrScannerComponent: React.FC<QrScannerComponentProps> = ({ onScanSuccess, onScanError }) => {
  const [scanMode, setScanMode] = useState<'camera' | 'manual' | 'upload'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const demoCodes = [
    { code: 'MV-AMX120-001', label: 'Amoxicillin Premium', type: 'Genuine code (Active)' },
    { code: 'MV-LIP902-101', label: 'Lipitor Cardia', type: 'Expired code (Safety Warning)' },
    { code: 'MV-PAR404-501', label: 'Paracetamol Rapid', type: 'Duplicate clone code (Suspicious alert)' },
    { code: 'MV-FAKE-999-XYZ', label: 'Unregistered Code', type: 'Invalid code (Counterfeit warning)' },
  ];

  useEffect(() => {
    if (scanMode === 'camera') {
      try {
        // Initialize HTML5-qrcode Scanner
        const scanner = new Html5QrcodeScanner(
          'qr-interactive-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            supportedScanTypes: [0] // Camera only
          },
          /* verbose= */ false
        );

        scanner.render(
          (decodedText) => {
            onScanSuccess(decodedText);
            // Auto stop/minimize on successful verify
            try {
              scanner.clear();
            } catch (e) {
              console.warn('Scanner clear error:', e);
            }
          },
          (err) => {
            if (onScanError) onScanError(err);
          }
        );

        scannerRef.current = scanner;
      } catch (err: any) {
        console.error('Failed to boot camera scanner:', err);
        setErrorMessage('Failed to access camera stream. Please guarantee clipboard access or select fallback modes.');
      }
    } else {
      // Clear scanner on component teardown or mode switch
      cleanupScanner();
    }

    return () => {
      cleanupScanner();
    };
  }, [scanMode]);

  const cleanupScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (e) {
        // Already cleared or element unmounted
      }
      scannerRef.current = null;
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    onScanSuccess(manualCode.trim());
  };

  const handleDemoCodeClick = (code: string) => {
    onScanSuccess(code);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulated parsing of local files / reading code string
    // In html5-qrcode file scanning we can try decoding or simulate file mapping for mock testing
    setErrorMessage(null);
    
    // In standard environments we look for qr contents. Let's look for a text string inside file or map based on name
    // Provide a beautiful intuitive fallback simulated scan
    const reader = new FileReader();
    reader.onload = () => {
      // If mock file can be parsed, or simulate mapping
      const simulatedText = file.name.toUpperCase().includes('EXPIRED') 
        ? 'MV-LIP902-101' 
        : file.name.toUpperCase().includes('CLONE') || file.name.toUpperCase().includes('FAK') 
          ? 'MV-PAR404-501' 
          : 'MV-AMX120-001';
      onScanSuccess(simulatedText);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden" id="qr-scanner-widget">
      {/* Toggles */}
      <div className="flex bg-gray-50/50 border-b border-gray-100 p-2">
        <button
          onClick={() => setScanMode('camera')}
          className={`flex-1 flex justify-center items-center space-x-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            scanMode === 'camera'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Camera className="h-4 w-4" />
          <span>Live Camera</span>
        </button>
        <button
          onClick={() => setScanMode('manual')}
          className={`flex-1 flex justify-center items-center space-x-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            scanMode === 'manual'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Clipboard className="h-4 w-4" />
          <span>Manual Entry</span>
        </button>
        <button
          onClick={() => setScanMode('upload')}
          className={`flex-1 flex justify-center items-center space-x-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            scanMode === 'upload'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Image</span>
        </button>
      </div>

      <div className="p-6">
        {/* CAMERA MODE */}
        {scanMode === 'camera' && (
          <div className="flex flex-col items-center">
            {errorMessage && (
              <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}
            
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-slate-50 min-h-[280px] flex flex-col justify-center items-center">
              <div id="qr-interactive-reader" className="w-full"></div>
              
              {/* Scan HUD Overlay (Styled purely with negative relative positioning/absolute centering) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-48 h-48 border-2 border-teal-500 rounded-lg flex justify-center items-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-teal-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-teal-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-teal-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-teal-500"></div>
                <div className="w-full h-0.5 bg-teal-500/80 animate-pulse animate-bounce absolute top-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            
            <p className="mt-4 text-xs text-slate-500 text-center">
              Align the drug package serial QR code within the boundaries shown above to trigger detection.
            </p>
          </div>
        )}

        {/* MANUAL ENTRY */}
        {scanMode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4 max-w-md mx-auto">
            <div>
              <label htmlFor="serial-code-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Serial Code Identifier
              </label>
              <div className="relative">
                <input
                  id="serial-code-input"
                  type="text"
                  required
                  placeholder="e.g. MV-AMX120-001"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="block w-full rounded-xl border-gray-200 outline-teal-600 bg-gray-50 focus:bg-white p-3 pr-10 text-sm font-mono tracking-tight transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Enter the printed registration code located directly underneath the QR code box on your safety seal.
            </p>
          </form>
        )}

        {/* UPLOAD FILE */}
        {scanMode === 'upload' && (
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="border-2 border-dashed border-gray-200 hover:border-teal-500 bg-gray-50/50 hover:bg-white rounded-2xl p-8 cursor-pointer transition-all relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload QR Code file image"
              />
              <UploadCloud className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Drag or click to choose QR Code Image</p>
              <p className="text-xs text-slate-400 mt-1">Allows uploading scanned camera photographs or barcode images</p>
            </div>
          </div>
        )}

        {/* MOCK DEMO CODES CHECKPOINT */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest text-center mb-4">
            Interactive Test Registry Codes
          </h4>
          <p className="text-[11px] text-slate-500 text-center mb-4 max-w-sm mx-auto">
            These pre-seeded codes represent four drug outcomes. Click a code to simulate immediate scanner authentication without requiring physical QR packaging:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {demoCodes.map((demo, idx) => (
              <div
                key={idx}
                className="flex flex-col text-left border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30 rounded-xl p-3 transition-all relative group cursor-pointer"
                onClick={() => handleDemoCodeClick(demo.code)}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-800 font-mono tracking-tight">{demo.code}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(demo.code, idx);
                    }}
                    className="p-1 text-slate-400 hover:text-teal-600 rounded-md bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy Code"
                  >
                    {copiedIndex === idx ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-1 leading-none">{demo.label}</span>
                <span className={`text-[9px] font-mono mt-1.5 px-1.5 py-0.5 rounded-md inline-block self-start font-medium leading-none ${
                  idx === 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : idx === 1
                      ? 'bg-amber-50 text-amber-700'
                      : idx === 2
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                }`}>
                  {demo.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, MessageSquare, AlertTriangle, CheckCircle2, FileText, Camera } from 'lucide-react';

interface Report {
  id: number;
  title: string;
  comments: string;
  photoUrl?: string;
  status: 'Pending' | 'Investigating' | 'Resolved';
  medicineName?: string;
  batchNumber?: string;
  createdAt: string;
  User?: { name: string; email: string };
}

export const ReportsPage: React.FC = () => {
  const { user, token } = useAuth();
  
  // States
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Submit states
  const [title, setTitle] = useState('');
  const [comments, setComments] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        setErrorMsg('Failed to fetch reports index.');
      }
    } catch {
      setErrorMsg('Failed to connect to backend support.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('You must be logged in to file a regulatory suspicious report.');
      return;
    }

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          comments,
          medicineName,
          batchNumber,
          photoUrl: photoBase64,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTitle('');
        setComments('');
        setMedicineName('');
        setBatchNumber('');
        setPhotoBase64('');
        fetchReports();
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        setErrorMsg('Failed to post report safely.');
      }
    } catch {
      setErrorMsg('Endpoint connection failed.');
    }
  };

  const handleStatusUpdate = async (reportId: number, status: 'Pending' | 'Investigating' | 'Resolved') => {
    if (!token || user?.role !== 'Admin') return;

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchReports();
      } else {
        alert('Unauthorized actions');
      }
    } catch {
      alert('Failed saving state change');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 text-left" id="reports-module">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block">
            Suspicious Counterfeits Audit Registry
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Report Suspicious Medicine Actions
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mx-auto text-balance leading-normal font-medium">
            Help health organizations identify malicious suppliers. File a verified packaging report instantly below to initiate regulatory auditing.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Submit Report */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
              file anomalies report
            </h3>

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-bounce" />
                <span className="font-bold">Regulatory report uploaded successfully!</span>
              </div>
            )}

            {!user ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">Authentication Required</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-medium">
                  You must register or log as an admin, pharmacy representative, or consumer before uploading reports inside the registry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Anomalous Defect Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Broken safety seal scan duplicate alert"
                    className="block w-full rounded-xl border border-slate-200 bg-white focus:bg-white p-3 text-xs outline-hidden focus:ring-2 focus:ring-blue-605/30 focus:border-blue-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      placeholder="e.g. Paracetamol"
                      className="block w-full rounded-xl border border-slate-200 bg-white focus:bg-white p-3 text-xs outline-hidden focus:ring-2 focus:ring-blue-605/30 focus:border-blue-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Batch Identifier
                    </label>
                    <input
                      type="text"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      placeholder="e.g. PAR-404"
                      className="block w-full rounded-xl border border-slate-200 bg-white focus:bg-white p-3 text-xs outline-hidden focus:ring-2 focus:ring-blue-605/30 focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Comments & Description of Anomaly
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Provide specific notes about where you purchased this drug unit and why the package appears counterfeit..."
                    className="block w-full rounded-xl border border-slate-200 bg-white focus:bg-white p-3 text-xs outline-hidden focus:ring-2 focus:ring-blue-605/30 focus:border-blue-600 transition-colors"
                  ></textarea>
                </div>

                {/* Optional Image attachment */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Attach Defect Photograph (Optional)
                  </label>
                  <div className="relative border border-dashed border-slate-200 bg-slate-50 hover:bg-white rounded-xl p-4 text-center cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Camera className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 block font-semibold">
                      {photoBase64 ? 'Photograph attached ✓' : 'Support JPG or PNG file'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center space-x-2 bg-blue-650 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>Submit Investigative Report</span>
                </button>
              </form>
            )}
          </div>

          {/* List reports reported */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
              reported compliance list
            </h3>

            {loading ? (
              <div className="text-center py-10 text-slate-400 text-xs">Loading logs...</div>
            ) : reports.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">No counterfeit reports reported to date.</div>
            ) : (
              <div className="space-y-4">
                {reports.map((rep) => (
                  <div key={rep.id} className="border border-slate-200 rounded-xl p-4 text-xs space-y-3 bg-slate-50/20">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{rep.title}</h4>
                        <div className="flex gap-2 text-[10px] text-slate-400 mt-1 flex-wrap font-medium">
                          <span>Reported by: <strong>{rep.User ? rep.User.name : 'Citizen consumer'}</strong></span>
                          <span>•</span>
                          <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase leading-none ${
                        rep.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-705'
                          : rep.status === 'Investigating'
                            ? 'bg-amber-50 text-amber-705 animate-pulse'
                            : 'bg-blue-50 text-blue-705'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] leading-relaxed text-slate-600 font-medium">
                      {rep.comments}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500 font-medium font-mono">
                      <div>
                        <span>Medicine: <strong className="text-slate-750">{rep.medicineName || 'N/A'}</strong></span>
                      </div>
                      <div>
                        <span>Batch ID: <strong className="text-slate-750">{rep.batchNumber || 'N/A'}</strong></span>
                      </div>
                    </div>

                    {rep.photoUrl && (
                      <div className="pt-2">
                        <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 font-mono">Attached photograph:</span>
                        <img src={rep.photoUrl} alt="Defect" className="max-h-28 rounded-lg border border-slate-200 object-cover" />
                      </div>
                    )}

                    {/* Admin Actions */}
                    {user?.role === 'Admin' && (
                      <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2 text-[10px] font-sans">
                        <span className="text-[10px] text-slate-400 mr-2 font-mono">Flag as:</span>
                        <button
                          onClick={() => handleStatusUpdate(rep.id, 'Investigating')}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold transition-colors cursor-pointer border border-amber-100"
                        >
                          Investigating
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(rep.id, 'Resolved')}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold transition-colors cursor-pointer border border-emerald-100"
                        >
                          Resolved
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

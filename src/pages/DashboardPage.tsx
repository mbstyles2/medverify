import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  AlertTriangle,
  History,
  Activity,
  PlusCircle,
  FolderLock,
  DownloadCloud,
  FileCheck2,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  Users,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { Medicine, Batch, SerialCode, Report } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();

  // Unified Dashboard states
  const [stats, setStats] = useState({
    totalScans: 24,
    genuineScans: 22,
    suspiciousScans: 2,
    expiredScans: 0,
    invalidScans: 0,
    medicineCount: 3,
    batchCount: 3,
    pendingReports: 1,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  // Selected sub-tab (for layout controls)
  const [dashboardTab, setDashboardTab] = useState<'analytics' | 'medicines' | 'batches' | 'reports' | 'users'>('analytics');

  // Form states - Add/Edit Medicine
  const [isEditingMedicine, setIsEditingMedicine] = useState<number | null>(null);
  const [medName, setMedName] = useState('');
  const [medMfg, setMedMfg] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDesc, setMedDesc] = useState('');

  // Form states - Create Batch (which spawns serial codes)
  const [batchNum, setBatchNum] = useState('');
  const [batchMfgDate, setBatchMfgDate] = useState('');
  const [batchExpDate, setBatchExpDate] = useState('');
  const [selectedMedId, setSelectedMedId] = useState('');
  const [qrQty, setQrQty] = useState('5');
  const [createdCodesSheet, setCreatedCodesSheet] = useState<string[]>([]);

  // General loading/errors
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch all core datasets from APIs upon loading
  const fetchDashboardData = async () => {
    try {
      // 1. Fetch medicines
      const medRes = await fetch('/api/medicines');
      if (medRes.ok) {
        setMedicines(await medRes.ok ? await medRes.json() : []);
      }

      // 2. Fetch batches
      const batRes = await fetch('/api/batches');
      if (batRes.ok) {
        setBatches(await batRes.json());
      }

      // 3. Fetch reports
      const repRes = await fetch('/api/reports');
      if (repRes.ok) {
        setReports(await repRes.json());
      }

      // 4. Fetch metrics analytics data
      if (token) {
        const statsRes = await fetch('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
          setRecentLogs(statsData.recentLogs);
        }
      }
    } catch (e) {
      console.warn('Dashboard api retrieval offline fallback used.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // --- MEDICINE CRUD OPERATIONS ---
  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName || !medMfg || !medDosage) return;
    setActionLoading(true);
    setActionError(null);

    const isEdit = isEditingMedicine !== null;
    const url = isEdit ? `/api/medicines/${isEditingMedicine}` : '/api/medicines';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: medName,
          manufacturer: medMfg,
          dosage: medDosage,
          description: medDesc,
        }),
      });

      if (response.ok) {
        setMedName('');
        setMedMfg('');
        setMedDosage('');
        setMedDesc('');
        setIsEditingMedicine(null);
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        setActionError(errorData.error || 'Failed saving medicine index.');
      }
    } catch {
      setActionError('Endpoint connection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (med: Medicine) => {
    setIsEditingMedicine(med.id);
    setMedName(med.name);
    setMedMfg(med.manufacturer);
    setMedDosage(med.dosage);
    setMedDesc(med.description || '');
  };

  const handleDeleteMedicine = async (id: number) => {
    if (!confirm('Are you certain you want to remove this medicine record? All linked batch and QR logs will destroy.')) return;
    setActionError(null);

    try {
      const response = await fetch(`/api/medicines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        setActionError('Failed to delete medicine index.');
      }
    } catch {
      setActionError('Endpoint communication failed.');
    }
  };

  // --- BATCH & CODES ACTIONS ---
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNum || !batchMfgDate || !batchExpDate || !selectedMedId) {
      alert('All batch inputs are mandatory.');
      return;
    }

    setActionLoading(true);
    setActionError(null);
    setCreatedCodesSheet([]);

    try {
      const response = await fetch('/api/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          batchNumber: batchNum,
          mfgDate: batchMfgDate,
          expDate: batchExpDate,
          MedicineId: parseInt(selectedMedId),
          codeQuantity: parseInt(qrQty),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBatchNum('');
        setBatchMfgDate('');
        setBatchExpDate('');
        setSelectedMedId('');
        
        // Save the newly spawned serial lists to present as download/print sheet right on the UI!
        if (data.SerialCodes) {
          const codesList = data.SerialCodes.map((c: any) => c.code);
          setCreatedCodesSheet(codesList);
        }
        
        fetchDashboardData();
      } else {
        setActionError(data.error || 'Fault creating batch record.');
      }
    } catch {
      setActionError('Network registry timeout.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadSheet = () => {
    if (createdCodesSheet.length === 0) return;
    
    // Create text file link easily representing serial keys list for print sheet
    const content = createdCodesSheet.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MedVerify-Batch-PrintSheet-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerMockReportResolve = async (id: number) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Resolved' }),
      });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch {
      alert('Failed to resolve report status.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-xs text-left" id="user-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header Component */}
        <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="p-2 px-3 bg-blue-50 text-blue-600 rounded-lg inline-block mb-2 font-mono text-[9px] font-bold uppercase tracking-widest leading-none border border-blue-100">
              Secured Portal Workspace
            </span>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none">
              Welcome back, {user?.name || 'Authorized Member'}!
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-normal font-medium">
              Registered Role: <strong className="text-blue-600 uppercase font-mono">{user?.role || 'Guest'}</strong> | Protecting regional patient drug delivery networks by validating product serial checksums.
            </p>
          </div>
          <div className="flex gap-2 text-slate-500 font-medium">
            <span className="text-xs">
              Logged in as {user?.email}
            </span>
          </div>
        </header>

        {actionError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-bold font-sans">
            {actionError}
          </div>
        )}

        {/* METRICS / STATS NUMERICS BLOCKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <History className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Total Checked</span>
              <span className="text-lg font-bold text-slate-800">{stats.totalScans} scans</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Genuine Checks</span>
              <span className="text-lg font-bold text-slate-800">{stats.genuineScans} units</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">Suspicious Logs</span>
              <span className="text-lg font-bold text-slate-800">{stats.suspiciousScans + stats.invalidScans} attempts</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">Active Batches</span>
              <span className="text-lg font-bold text-slate-800">{stats.batchCount} folders</span>
            </div>
          </div>
        </div>

        {/* WORKSPACE CONTROL TABS (ADMINS & MANUFACTURERS ONLY) */}
        {(user?.role === 'Admin' || user?.role === 'Manufacturer') ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar Tab Navigation Menu */}
            <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 px-3 mb-3">
                Workspace Controls
              </span>
              <button
                onClick={() => setDashboardTab('analytics')}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                  dashboardTab === 'analytics' ? 'bg-blue-55 text-blue-700 font-extrabold border-l-4 border-blue-600 pl-2' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Unified Audit Logs</span>
              </button>
              <button
                onClick={() => setDashboardTab('medicines')}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                  dashboardTab === 'medicines' ? 'bg-blue-55 text-blue-700 font-extrabold border-l-4 border-blue-600 pl-2' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Activity className="h-4 w-4 text-blue-600" />
                <span>Medicine Registry ({medicines.length})</span>
              </button>
              <button
                onClick={() => setDashboardTab('batches')}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                  dashboardTab === 'batches' ? 'bg-blue-55 text-blue-700 font-extrabold border-l-4 border-blue-600 pl-2' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Layers className="h-4 w-4 text-blue-600" />
                <span>Batch & QR Printer ({batches.length})</span>
              </button>
              <button
                onClick={() => setDashboardTab('reports')}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                  dashboardTab === 'reports' ? 'bg-blue-55 text-blue-700 font-extrabold border-l-4 border-blue-600 pl-2' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span>Counterfeit Alerts ({reports.length})</span>
              </button>
              <button
                onClick={() => setDashboardTab('users')}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                  dashboardTab === 'users' ? 'bg-blue-55 text-blue-700 font-extrabold border-l-4 border-blue-600 pl-2' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Users className="h-4 w-4 text-blue-600" />
                <span>System Authority List</span>
              </button>
            </div>

            {/* Right Tab Contents Render Block */}
            <div className="lg:col-span-9 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[480px]">
              {/* ANALYTICS SUB-TAB */}
              {dashboardTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
                    Unified Scan Checkpoint Transaction History
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-widest text-[9px] font-mono leading-none">
                          <th className="pb-3 text-left">Checked Drug</th>
                          <th className="pb-3 text-left font-mono">Serial QR Code</th>
                          <th className="pb-3 text-left">Scan Location</th>
                          <th className="pb-3 text-left">User</th>
                          <th className="pb-3 text-left">Date Checked</th>
                          <th className="pb-3 text-right">Result Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {recentLogs.map((log: any) => (
                          <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 font-semibold text-slate-900 text-xs">
                              {log.medicineName || 'Unregistered Input'}
                              <span className="block text-[9px] font-normal text-slate-400 mt-0.5">Lot ID: {log.batchNumber}</span>
                            </td>
                            <td className="py-3 font-mono font-medium text-[10px] text-slate-550">{log.serialCode}</td>
                            <td className="py-3 font-sans max-w-xs truncate text-[11px] font-medium text-slate-600">{log.location}</td>
                            <td className="py-3 font-medium text-slate-700">{log.user}</td>
                            <td className="py-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                            <td className="py-3 text-right">
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase leading-none ${
                                log.result === 'Genuine'
                                  ? 'bg-emerald-50 text-emerald-705'
                                  : log.result === 'Expired'
                                    ? 'bg-amber-50 text-amber-705'
                                    : 'bg-rose-50 text-rose-705'
                              }`}>
                                {log.result}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MEDICINES REGISTRY CRUD TAB */}
              {dashboardTab === 'medicines' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                      Medication Registry Database CRUD Index
                    </h3>
                  </div>

                  {/* Add / Edit Form */}
                  <form onSubmit={handleSaveMedicine} className="bg-slate-50 p-4 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div className="col-span-1 md:col-span-3">
                      <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">
                        {isEditingMedicine ? 'Edit Drug Details Row' : 'Register New Drug Profile'}
                      </h4>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Drug Name</label>
                      <input
                        type="text"
                        required
                        value={medName}
                        onChange={(e) => setMedName(e.target.value)}
                        placeholder="e.g. Paracetamol Rapid"
                        className="block w-full bg-white rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Manufacturer Location</label>
                      <input
                        type="text"
                        required
                        value={medMfg}
                        onChange={(e) => setMedMfg(e.target.value)}
                        placeholder="e.g. Pfizer Labs US"
                        className="block w-full bg-white rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Concentration / Dosage</label>
                      <input
                        type="text"
                        required
                        value={medDosage}
                        onChange={(e) => setMedDosage(e.target.value)}
                        placeholder="e.g. 500mg capsules"
                        className="block w-full bg-white rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-2 text-xs"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Support Safety Description</label>
                      <input
                        type="text"
                        value={medDesc}
                        onChange={(e) => setMedDesc(e.target.value)}
                        placeholder="Enter warnings or specifications on this chemistry"
                        className="block w-full bg-white rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full flex justify-center items-center space-x-1.5 bg-blue-650 hover:bg-blue-700 text-white font-bold p-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>{isEditingMedicine ? 'Save Changes' : 'Write Record'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Medicines list table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-slate-700">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-450 text-[10px] uppercase font-mono pb-2">
                          <th className="pb-2">Drug Name</th>
                          <th className="pb-2">Dosage Concentration</th>
                          <th className="pb-2">Manufacturer Company</th>
                          <th className="pb-2">Status Code</th>
                          <th className="pb-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 leading-normal font-medium">
                        {medicines.map((med) => (
                          <tr key={med.id}>
                            <td className="py-2.5 font-bold text-slate-800">{med.name}</td>
                            <td className="py-2.5">{med.dosage}</td>
                            <td className="py-2.5 font-semibold text-slate-500">{med.manufacturer}</td>
                            <td className="py-2.5 font-mono text-[10px] text-slate-400">ID: {med.id}</td>
                            <td className="py-2.5 text-right space-x-2">
                              <button
                                onClick={() => handleEditClick(med)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-md inline-block cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMedicine(med.id)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded-md inline-block cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* BATCHES & PRINTABLE QR CODES SHEET TAB */}
              {dashboardTab === 'batches' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
                    Batch Generation & Printable QR Code Sheets
                  </h3>

                  {/* Form to spawn a new batch */}
                  <form onSubmit={handleCreateBatch} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                    <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                      Create Manufacturing Batch & Auto-Generate Unique Registries QR Codes
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Batch ID / Number</label>
                        <input
                          type="text"
                          required
                          value={batchNum}
                          onChange={(e) => setBatchNum(e.target.value.toUpperCase())}
                          placeholder="e.g. AMX-120"
                          className="block w-full bg-white rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Manufacturing Date</label>
                        <input
                          type="date"
                          required
                          value={batchMfgDate}
                          onChange={(e) => setBatchMfgDate(e.target.value)}
                          className="block w-full bg-white rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                        <input
                          type="date"
                          required
                          value={batchExpDate}
                          onChange={(e) => setBatchExpDate(e.target.value)}
                          className="block w-full bg-white rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Drug Formula</label>
                        <select
                          required
                          value={selectedMedId}
                          onChange={(e) => setSelectedMedId(e.target.value)}
                          className="block w-full bg-white rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 p-2 text-xs"
                        >
                          <option value="">-- Choose --</option>
                          {medicines.map((m) => (
                            <option key={m.id} value={m.id}>{m.name} ({m.dosage})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center justify-between pt-2 border-t border-slate-200">
                      <div className="flex gap-2 items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Spawn unique serial quantity:</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={qrQty}
                          onChange={(e) => setQrQty(e.target.value)}
                          className="w-16 bg-white p-2 rounded-xl border border-slate-200 text-center font-bold font-mono outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-blue-650 hover:bg-blue-700 text-white font-bold p-2.5 px-6 rounded-xl text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Layers className="h-4 w-4" />
                        <span>Spawn Batch & Export Codes</span>
                      </button>
                    </div>
                  </form>

                  {/* PRINT SHEET DOCK PREVIEW */}
                  {createdCodesSheet.length > 0 && (
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-emerald-800 font-bold font-sans flex items-center gap-1 text-xs">
                          <FileCheck2 className="h-4 w-4" />
                          <span>Batch Spatials sheet exports completed!</span>
                        </h4>
                        <button
                          onClick={handleDownloadSheet}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 text-xs rounded-lg font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <DownloadCloud className="h-3.5 w-3.5" />
                          <span>Download Printable Codes File</span>
                        </button>
                      </div>
                      
                      {/* Printable grid represent */}
                      <p className="text-[10px] text-emerald-950 leading-relaxed max-w-sm">
                        These spawned serialized checks are prepackaged into code registries. Click above to download, or print these mock drug label assets for validation checks:
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                        {createdCodesSheet.map((serial) => (
                          <div key={serial} className="bg-white border border-slate-200 rounded-xl p-2 text-center flex flex-col items-center">
                            {/* Visual QR Simulator box */}
                            <div className="w-12 h-12 bg-slate-900 flex flex-col relative rounded-md items-center justify-center p-1 text-[7px] text-white">
                              <span className="font-mono font-bold select-all leading-none">QR</span>
                              <div className="absolute top-0.5 left-0.5 w-2 h-2 border border-white"></div>
                              <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border border-white"></div>
                              <div className="absolute top-0.5 right-0.5 w-2 h-2 border border-white"></div>
                            </div>
                            <span className="text-[9px] font-mono mt-1 font-bold text-slate-800 select-all">{serial || '---'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Batches list */}
                  <div className="space-y-3 text-left">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Batches folders</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {batches.map((b: any) => (
                        <div key={b.id} className="border border-slate-200 bg-slate-50/35 p-4 rounded-xl flex justify-between items-start">
                          <div>
                            <span className="text-blue-600 font-bold text-sm tracking-tight">{b.batchNumber}</span>
                            <span className="block text-[11px] text-slate-700 font-semibold mt-1">Medicine: {b.Medicine?.name}</span>
                            <div className="flex gap-4 text-[10px] text-slate-455 mt-2 font-mono">
                              <span>Mfg: {b.mfgDate}</span>
                              <span>Exp: <strong className="text-amber-600">{b.expDate}</strong></span>
                            </div>
                          </div>
                          <span className="p-2 py-1 bg-white border border-slate-200 font-mono text-slate-500 font-bold rounded-lg leading-none">
                            {b.SerialCodes?.length} labels
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* REPORT ANOMALIES LOG TAB */}
              {dashboardTab === 'reports' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
                    Counterfeit Alerts & Patient Report Investigation Actions
                  </h3>

                  <div className="space-y-4">
                    {reports.map((rep) => (
                      <div key={rep.id} className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm leading-none">{rep.title}</h4>
                            <span className="text-[9px] text-slate-400 block mt-1">
                              Filed at {new Date(rep.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-md leading-none ${
                            rep.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700 animate-pulse'
                          }`}>
                            {rep.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 bg-white border border-slate-200 p-3 rounded-xl">{rep.comments}</p>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] text-slate-500 font-mono">
                            Alert targeted: <strong>{rep.medicineName}</strong> (Lot: {rep.batchNumber})
                          </span>

                          {rep.status !== 'Resolved' && (
                            <button
                              onClick={() => triggerMockReportResolve(rep.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 px-3 rounded-lg font-bold text-[10px] transition-transform cursor-pointer"
                            >
                              Flag as Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SYSTEM AUTHORITY VIEW TAB */}
              {dashboardTab === 'users' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
                    Authorized System Stakeholders Index
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-800 font-sans text-xs">System Compliance Manager</span>
                        <span className="block text-[10px] text-slate-405 mt-1">Email: admin@medverify.com</span>
                      </div>
                      <span className="p-1 px-2.5 bg-rose-50 text-rose-750 font-mono font-bold uppercase rounded-md">Admin</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-800 font-sans text-xs">BioPharma Global</span>
                        <span className="block text-[10px] text-slate-405 mt-1">Location Address: Industrial Sector Suite 10 | Lic: MFG-2019-88</span>
                      </div>
                      <span className="p-1 px-2.5 bg-indigo-50 text-indigo-755 font-mono font-bold uppercase rounded-md">Manufacturer</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-800 font-sans text-xs">City Care Pharmacy</span>
                        <span className="block text-[10px] text-slate-405 mt-1">Location: 492 Medical Way, NY | Lic: PH-9821-A</span>
                      </div>
                      <span className="p-1 px-2.5 bg-blue-50 text-blue-750 font-mono font-bold uppercase rounded-md">Pharmacy</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // CONSUMER & PHARMACY REDUCED WORKSPACE DASHBOARD
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-805 uppercase tracking-widest border-b border-slate-100 pb-3">
              Consumer Safety Checkpoint Logs
            </h3>
            
            <p className="text-[11px] text-slate-400 leading-normal max-w-xl font-medium">
              As a pharmacy representative or medical consumer, the main action is scanning the container's thermal-sealed serial label. You can view your recent checks or file an investigation record concerning suspicious products below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-slate-850">Need Immediate Verification?</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Open the verification stream to instantly trigger validation protocols via webcam cameras or keyboard typing.
                </p>
                <div className="pt-2">
                  <span className="p-2 border border-emerald-500 rounded-lg text-emerald-700 bg-emerald-50/50 font-bold block text-center cursor-pointer hover:bg-emerald-50 transition-all font-mono text-xs">
                    Open Scan Checkpoint Camera
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-slate-850">Identify Defective Seals?</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Submit investigative safety audits dynamically to compliance boards if packaging appear torn, smudged or clonable.
                </p>
                <div className="pt-2">
                  <span className="p-2 border border-slate-300 rounded-lg text-slate-600 bg-white font-bold block text-center cursor-pointer hover:bg-slate-50 transition-all font-mono text-xs">
                    File Suspicious Alert Report
                  </span>
                </div>
              </div>
            </div>
            
            {/* Simple static list of scan histories log details matching simulated indicators */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Your transaction scan logs</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-50 p-3 flex justify-between text-slate-400 font-mono font-bold text-[10px]">
                  <span>Medicine Name</span>
                  <span>Validation Date</span>
                  <span>Results Status</span>
                </div>
                <div className="p-4 flex justify-between items-center text-slate-700 border-b border-slate-100 font-medium bg-white">
                  <div>
                    <span className="font-bold block text-slate-800">Amoxicillin Premium</span>
                    <span className="text-[10px] text-slate-400 font-normal">Unique Code Checked: MV-AMX120-001</span>
                  </div>
                  <span className="text-slate-400">Oct 24, 2026</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-705 font-mono font-bold uppercase rounded-md">Genuine</span>
                </div>
                <div className="p-4 flex justify-between items-center text-slate-700 font-medium bg-white">
                  <div>
                    <span className="font-bold block text-slate-850">Paracetamol Rapid (Cloned copy alert)</span>
                    <span className="text-[10px] text-rose-600 font-normal">Replays detected: 14 times previous</span>
                  </div>
                  <span className="text-slate-400">Oct 20, 2026</span>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-705 font-mono font-bold uppercase rounded-md animate-pulse">Suspicious</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

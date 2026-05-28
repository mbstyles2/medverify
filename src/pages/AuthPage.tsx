import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserCheck, ShieldCheck, Mail, Lock, User, Phone, CheckCircle2, Clipboard } from 'lucide-react';

interface AuthPageProps {
  setView: (view: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ setView }) => {
  const { login } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState<'Consumer' | 'Pharmacy' | 'Manufacturer' | 'Admin'>('Consumer');
  
  // General inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Role-specific inputs
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [adminCode, setAdminCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const demoAccounts = [
    { email: 'admin@medverify.com', label: 'Admin Workspace' },
    { email: 'manufacturer@medverify.com', label: 'Manufacturer' },
    { email: 'pharmacy@medverify.com', label: 'Pharmacy Desk' },
    { email: 'consumer@medverify.com', label: 'Consumer Account' },
  ];

  const handleDemoFill = (demoEmail: string) => {
    setIsLoginMode(true);
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const apiEndpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';

    // Assemble payload
    let details: Record<string, any> = {};
    if (!isLoginMode) {
      if (role === 'Consumer') {
        details = { phone };
      } else if (role === 'Pharmacy') {
        details = { licenseNumber, address, phone };
      } else if (role === 'Manufacturer') {
        details = { regNumber, contactPerson, address, phone };
      } else if (role === 'Admin') {
        details = { adminCode };
      }
    }

    const payload = isLoginMode
      ? { email, password }
      : {
          name: isLoginMode ? '' : name,
          email,
          password,
          role,
          details,
        };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server registration/login anomaly.');
      }

      setSuccessMsg(isLoginMode ? 'Signing in...' : 'Registrar completed successfully!');
      
      // Complete login state update
      login(data.token, data.user);

      setTimeout(() => {
        setView('dashboard');
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification system connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-left" id="auth-page-root">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        {/* Title Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <ShieldCheck className="h-6 w-6" id="auth-shield-icon" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {isLoginMode ? 'Sign in to MedVerify' : 'Register Secure Account'}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {isLoginMode
              ? 'Enter your credentials or click a preconfigured tester account below'
              : 'Supply credentials matching your business role category'}
          </p>
        </div>

        {/* Messaging Feedback */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 leading-normal font-bold">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Register vs Login toggles */}
        <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200/55">
          <button
            onClick={() => {
              setIsLoginMode(true);
              setErrorMsg(null);
            }}
            className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isLoginMode ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In Mode
          </button>
          <button
            onClick={() => {
              setIsLoginMode(false);
              setErrorMsg(null);
            }}
            className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isLoginMode ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register Mode
          </button>
        </div>

        {/* MAIN AUTH FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Register-Role Selection */}
          {!isLoginMode && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Institutional Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Consumer', 'Pharmacy', 'Manufacturer', 'Admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setName('');
                    }}
                    className={`text-center py-2.5 px-3 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                      role === r
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Core Email / Password Fields */}
          <div className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {role === 'Consumer'
                    ? 'Full Name'
                    : role === 'Pharmacy'
                      ? 'Pharmacy Legal Name'
                      : role === 'Manufacturer'
                        ? 'Manufacturer Company Name'
                        : 'Compliance Admin Title'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Jane Carter"
                    className="block w-full rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50 focus:bg-white p-3 pl-10 text-xs transition-colors shadow-inner"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="block w-full rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50 focus:bg-white p-3 pl-10 text-xs transition-colors shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50 focus:bg-white p-3 pl-10 text-xs transition-colors shadow-inner"
                />
              </div>
            </div>

            {/* DYNAMIC ROLE-SPECIFIC INPUTS (FOR REGISTER ONLY) */}
            {!isLoginMode && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {role} Required Information
                </h4>

                {/* Consumer / Pharmacy / Manufacturer details */}
                {(role === 'Consumer' || role === 'Pharmacy' || role === 'Manufacturer') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 0192"
                        className="block w-full rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50 focus:bg-white p-3 pl-10 text-xs transition-colors shadow-inner"
                      />
                    </div>
                  </div>
                )}

                {role === 'Pharmacy' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Pharmacy License Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. PH-9011-NY"
                      className="block w-full rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50 focus:bg-white p-3 text-xs transition-colors shadow-inner"
                    />
                  </div>
                )}

                {role === 'Manufacturer' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Manufacturing License/Company Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="e.g. MFG-88220-US"
                      className="block w-full rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50 focus:bg-white p-3 text-xs transition-colors shadow-inner"
                    />
                  </div>
                )}

                {role === 'Manufacturer' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Supplier Representative / Contact Person
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Dr. Marcus Vance"
                      className="block w-full rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50 focus:bg-white p-3 text-xs transition-colors shadow-inner"
                    />
                  </div>
                )}

                {(role === 'Pharmacy' || role === 'Manufacturer') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Physical Premises Address
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Industrial Sector Roadway, Suite 10"
                      className="block w-full rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50 focus:bg-white p-3 text-xs transition-colors shadow-inner"
                    />
                  </div>
                )}

                {role === 'Admin' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      MedVerify Private Authority Code (Compliance Gatepass)
                    </label>
                    <input
                      type="text"
                      required
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="e.g. ADMIN_MASTER_PASS_99"
                      className="block w-full rounded-xl border border-slate-200 outline-hidden focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-slate-50 focus:bg-white p-3 text-xs transition-colors shadow-inner"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isLoginMode ? <LogIn className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
            <span>{loading ? 'Authenticating...' : isLoginMode ? 'Access Portal Account' : 'Register Secure Credentials'}</span>
          </button>
        </form>

        {/* DEMO ACCOUNTS FILL CLINICS QUICKPANEL */}
        {isLoginMode && (
          <div className="pt-6 border-t border-slate-200">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
              One-Click Quick Tester Accounts
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleDemoFill(account.email)}
                  className="text-left flex justify-between items-center p-2.5 rounded-xl border border-slate-250 bg-slate-55 hover:bg-blue-50 hover:border-blue-200 text-[10px] text-slate-700 font-medium transition-all group cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 leading-none group-hover:text-blue-950">{account.label}</span>
                    <span className="text-[8px] font-mono text-slate-400 mt-1 block">{account.email.split('@')[0]}</span>
                  </div>
                  <Clipboard className="h-3 w-3 text-slate-400 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

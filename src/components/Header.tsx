import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, LogOut, Menu, X, LayoutDashboard, SearchCode, Info, PhoneCall } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (view: string) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigateTo('landing');
  };

  const navItems = [
    { label: 'Home', view: 'landing', icon: ShieldCheck },
    { label: 'About', view: 'about', icon: Info },
    { label: 'Contact', view: 'contact', icon: PhoneCall },
    { label: 'Scan verification', view: 'scan', icon: SearchCode },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-xs" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand */}
          <div className="flex items-center cursor-pointer space-x-2" onClick={() => navigateTo('landing')}>
            <span className="p-2 bg-blue-600 text-white rounded-lg flex items-center justify-center" id="brand-icon">
              <ShieldCheck className="h-5 w-5 font-semibold" />
            </span>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-lg tracking-tight text-slate-800 leading-none">MedVerify</span>
              <span className="text-[10px] font-mono font-medium text-blue-600 uppercase tracking-widest mt-0.5">Authenticity Hub</span>
            </div>
          </div>

          {/* Nav Links Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => navigateTo(item.view)}
                className={`flex items-center space-x-1.5 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                  currentView === item.view
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}

            {user && (
              <button
                onClick={() => navigateTo('dashboard')}
                className={`flex items-center space-x-1.5 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          {/* CTA & User Status Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800 leading-none">{user.name}</span>
                  <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider font-bold mt-0.5">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1 px-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('auth')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded-xl shadow-xs transition-all"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

          {/* Toggle Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => navigateTo(item.view)}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-semibold ${
                  currentView === item.view
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <item.icon className="h-5 w-5 text-blue-600" />
                <span>{item.label}</span>
              </button>
            ))}

            {user && (
              <button
                onClick={() => navigateTo('dashboard')}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-semibold ${
                  currentView === 'dashboard'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <LayoutDashboard className="h-5 w-5 text-blue-600" />
                <span>Dashboard</span>
              </button>
            )}

            <div className="border-t border-slate-200 my-2 pt-2 px-3">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center bg-slate-55 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{user.name}</span>
                      <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-semibold">{user.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-rose-50 hover:bg-rose-100 text-rose-600 py-2.5 rounded-xl font-semibold transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout Account</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateTo('auth')}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-semibold transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

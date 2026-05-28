import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';
import { ScannerPage } from './pages/ScannerPage';
import { ReportsPage } from './pages/ReportsPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  const [view, setView] = useState<string>('landing');

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans tracking-tight text-gray-800" id="medverify-app-root">
        {/* Navigation Sticky Header */}
        <Header currentView={view} setView={setView} />

        {/* Dynamic Pages Controller */}
        <main className="flex-1">
          {view === 'landing' && <LandingPage setView={setView} />}
          {view === 'about' && <AboutPage />}
          {view === 'contact' && <ContactPage />}
          {view === 'auth' && <AuthPage setView={setView} />}
          {view === 'scan' && <ScannerPage />}
          {view === 'reports' && <ReportsPage />}
          {view === 'dashboard' && <DashboardPage />}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}


import React, { useEffect, useState } from 'react';
import { ClientFormData, FormStatus, AppView } from './types';
import IntakeForm from './pages/IntakeForm';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { createIntakeSubmission } from './services/intakeSubmissions';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.INTAKE_FORM);
  const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE);
  const [isAuthed, setIsAuthed] = useState(false);
  
  const [formData, setFormData] = useState<ClientFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    rolePosition: '',
    services: {
      softwareDevelopment: false,
      aiWorkflowAutomation: false,
      websiteDesignDevelopment: false,
      digitalMarketingGrowth: false,
      bookkeepingAccounting: false,
      hrPayrollManagement: false,
      businessMentorshipConsultation: false,
    },
    selectedPackage: '',
    needsAndGoals: '',
    officeDuration: '',
    teamSize: '',
    eventType: '',
    expectedAttendees: '',
    preferredDate: '',
    currentlyUsingTools: '',
    mainChallenge: '',
    referralSource: [],
    otherReferralSource: '',
    preferredContact: '',
    bestTimeToReach: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: keyof ClientFormData['services']) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service]
      }
    }));
  };

  const handleReferralToggle = (source: string) => {
    setFormData(prev => {
      const current = prev.referralSource;
      if (current.includes(source)) {
        return { ...prev, referralSource: current.filter(s => s !== source) };
      } else {
        return { ...prev, referralSource: [...current, source] };
      }
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(FormStatus.SUBMITTING);

    try {
      await createIntakeSubmission(formData);
      setStatus(FormStatus.SUCCESS);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setStatus(FormStatus.ERROR);
    }
  };

  useEffect(() => {
    let mounted = true;

    // When Supabase redirects back from the recovery email link, it appends tokens to the URL hash.
    // We route to the reset-password screen if it's a recovery flow.
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      if (hash.includes('type=recovery')) {
        setView(AppView.RESET_PASSWORD);
      }
    }

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthed(!!data.session);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setIsAuthed(!!session);

      if (event === 'PASSWORD_RECOVERY') {
        setView(AppView.RESET_PASSWORD);
      }
      if (!session && view === AppView.ADMIN_DASHBOARD) {
        setView(AppView.LOGIN);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [view]);

  const handleLogin = () => {
    setView(AppView.ADMIN_DASHBOARD);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView(AppView.INTAKE_FORM);
  };

  // Router logic
  switch (view) {
    case AppView.LOGIN:
      return (
        <LoginPage
          onLogin={handleLogin}
          onBack={() => setView(AppView.INTAKE_FORM)}
          onForgotPassword={() => setView(AppView.PASSWORD_RECOVERY)}
        />
      );
    case AppView.PASSWORD_RECOVERY:
      return <PasswordRecoveryPage onBackToLogin={() => setView(AppView.LOGIN)} />;
    case AppView.RESET_PASSWORD:
      return <ResetPasswordPage onBackToLogin={() => setView(AppView.LOGIN)} />;
    case AppView.ADMIN_DASHBOARD:
      if (!isAuthed) {
        return (
          <LoginPage
            onLogin={handleLogin}
            onBack={() => setView(AppView.INTAKE_FORM)}
            onForgotPassword={() => setView(AppView.PASSWORD_RECOVERY)}
          />
        );
      }
      return <AdminDashboard onLogout={handleLogout} />;
    case AppView.INTAKE_FORM:
    default:
      return (
        <IntakeForm 
          formData={formData}
          status={status}
          onInputChange={handleInputChange}
          onServiceToggle={handleServiceToggle}
          onReferralToggle={handleReferralToggle}
          onSubmit={handleFormSubmit}
          onSwitchView={setView}
        />
      );
  }
};

export default App;

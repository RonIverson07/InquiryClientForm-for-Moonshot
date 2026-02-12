
import React, { useState } from 'react';
import { ClientFormData, FormStatus, AppView } from './types';
import IntakeForm from './pages/IntakeForm';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.INTAKE_FORM);
  const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE);
  
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(FormStatus.SUBMITTING);
    setTimeout(() => {
      setStatus(FormStatus.SUCCESS);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleLogin = () => {
    setView(AppView.ADMIN_DASHBOARD);
  };

  const handleLogout = () => {
    setView(AppView.INTAKE_FORM);
  };

  // Router logic
  switch (view) {
    case AppView.LOGIN:
      return <LoginPage onLogin={handleLogin} onBack={() => setView(AppView.INTAKE_FORM)} />;
    case AppView.ADMIN_DASHBOARD:
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

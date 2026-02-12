
import React, { useState } from 'react';
import { ClientFormData, FormStatus, AppView } from '../types';
import StepContactInfo from '../components/steps/StepContactInfo';
import StepServices from '../components/steps/StepServices';
import StepSpecificDetails from '../components/steps/StepSpecificDetails';
import StepReferral from '../components/steps/StepReferral';

interface IntakeFormProps {
  formData: ClientFormData;
  status: FormStatus;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onServiceToggle: (service: keyof ClientFormData['services']) => void;
  onReferralToggle: (source: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchView: (view: AppView) => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({
  formData,
  status,
  onInputChange,
  onServiceToggle,
  onReferralToggle,
  onSubmit,
  onSwitchView
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (status === FormStatus.SUCCESS) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-2xl shadow-xl max-w-md w-full text-center border-t-8 border-[#0ea5e9]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Submission Successful!</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for reaching out to StartupLab. Our team will review your information and get back to you shortly.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[#0ea5e9] text-white font-bold rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200"
          >
            Submit Another Form
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <StepContactInfo formData={formData} onInputChange={onInputChange} onNext={nextStep} />;
      case 2:
        return <StepServices formData={formData} onServiceToggle={onServiceToggle} onInputChange={onInputChange} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <StepSpecificDetails formData={formData} onInputChange={onInputChange} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <StepReferral formData={formData} status={status} onReferralToggle={onReferralToggle} onInputChange={onInputChange} onPrev={prevStep} onSubmit={onSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4 px-6 md:px-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-[#0ea5e9] text-white p-2 rounded-lg font-bold text-2xl tracking-tighter">SL</div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">StartupLab</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Business Center</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Step {currentStep} of {totalSteps}</p>
            </div>
            <button 
              onClick={() => onSwitchView(AppView.LOGIN)}
              className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#0ea5e9] hover:text-white transition-all shadow-sm"
            >
              Staff Login
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
          <div 
            className="h-full bg-[#0ea5e9] transition-all duration-500 ease-out" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto mt-12 px-6 w-full">
        {renderStep()}
      </main>

      <footer className="bg-slate-900 text-slate-500 py-10 px-6 text-center text-sm border-t-4 border-[#0ea5e9] w-full mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <span className="font-bold text-lg uppercase tracking-tight">StartupLab</span>
          </div>
          <p>© 2024 StartupLab Business Center. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IntakeForm;

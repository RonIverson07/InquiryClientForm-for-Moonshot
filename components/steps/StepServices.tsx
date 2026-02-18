
import React, { useMemo, useState } from 'react';
import { ClientFormData } from '../../types';
import { Checkbox } from '../Input';
import FormSection from '../FormSection';

interface StepProps {
  formData: ClientFormData;
  onServiceToggle: (service: keyof ClientFormData['services']) => void;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepServices: React.FC<StepProps> = ({ formData, onServiceToggle, onInputChange, onNext, onPrev }) => {
  const [showErrors, setShowErrors] = useState(false);

  const isValid = useMemo(() => {
    return Object.values(formData.services).some(Boolean);
  }, [formData.services]);

  const handleNext = () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  const packages = [
    "Virtual Office Package — ₱1,999 / month",
    "Co-working Space Standard — ₱4,999 / month",
    "Co-working Space Premium — ₱6,999 / month",
    "StartupLab Pro — ₱9,999 / month"
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <FormSection title="Services">
        <p className="text-slate-500 text-sm mb-8 font-medium">
          Services you're interested in (check all that apply)
          <span className="text-red-500 font-black"> *</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 mb-12">
          <Checkbox label="AI Workflow & Automation" checked={formData.services.aiWorkflowAutomation} onChange={() => onServiceToggle('aiWorkflowAutomation')} />
          <Checkbox label="Website Design & Development" checked={formData.services.websiteDesignDevelopment} onChange={() => onServiceToggle('websiteDesignDevelopment')} />
          <Checkbox label="Software Development (web apps, internal systems, custom solutions)" checked={formData.services.softwareDevelopment} onChange={() => onServiceToggle('softwareDevelopment')} />
          <Checkbox label="Digital Marketing & Growth Campaigns" checked={formData.services.digitalMarketingGrowth} onChange={() => onServiceToggle('digitalMarketingGrowth')} />
          <Checkbox label="Bookkeeping & Accounting Services" checked={formData.services.bookkeepingAccounting} onChange={() => onServiceToggle('bookkeepingAccounting')} />
          <Checkbox label="HR & Payroll Management" checked={formData.services.hrPayrollManagement} onChange={() => onServiceToggle('hrPayrollManagement')} />
          <Checkbox label="Business Mentorship & Strategic Consultation" checked={formData.services.businessMentorshipConsultation} onChange={() => onServiceToggle('businessMentorshipConsultation')} />
        </div>
        {showErrors && !isValid && (
          <p className="text-xs text-red-600 -mt-6 mb-8">Please select at least one service.</p>
        )}
        
        <div className="space-y-10">
          <div className="flex flex-col space-y-4">
            <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Interested Package (OPTIONAL)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <label key={pkg} className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer group ${formData.selectedPackage === pkg ? 'border-[#0ea5e9] bg-sky-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${formData.selectedPackage === pkg ? 'border-[#0ea5e9]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                    {formData.selectedPackage === pkg && <div className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]" />}
                  </div>
                  <input 
                    type="radio" 
                    name="selectedPackage" 
                    value={pkg} 
                    checked={formData.selectedPackage === pkg}
                    onChange={(e) => onInputChange(e)}
                    className="hidden"
                  />
                  <span className={`text-sm font-semibold transition-colors ${formData.selectedPackage === pkg ? 'text-[#0ea5e9]' : 'text-slate-600'}`}>
                    {pkg}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-16">
          <button 
            type="button"
            onClick={onPrev}
            className="px-10 py-4 bg-slate-100 text-slate-500 font-bold rounded-lg hover:bg-slate-200 transition-all uppercase tracking-widest text-sm"
          >
            Back
          </button>
          <button 
            type="button"
            onClick={handleNext}
            disabled={!isValid}
            className={`px-12 py-4 bg-[#0ea5e9] text-white font-bold rounded-lg shadow-xl shadow-sky-200 hover:bg-sky-600 transition-all uppercase tracking-widest text-sm ${!isValid ? 'opacity-60 cursor-not-allowed hover:bg-[#0ea5e9]' : ''}`}
          >
            Next: Details
          </button>
        </div>
      </FormSection>
    </div>
  );
};

export default StepServices;

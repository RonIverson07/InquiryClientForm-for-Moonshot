
import React, { useMemo, useState } from 'react';
import { ClientFormData } from '../../types';
import { TextInput } from '../Input';
import FormSection from '../FormSection';

interface StepProps {
  formData: ClientFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
}

const StepContactInfo: React.FC<StepProps> = ({ formData, onInputChange, onNext }) => {
  const [showErrors, setShowErrors] = useState(false);

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<'fullName' | 'email' | 'phoneNumber', string>> = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Full Name is required.';

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else {
      const value = formData.email.trim();
      const match = value.match(/^([^\s@]+)@([^\s@]+)$/);
      if (!match) {
        nextErrors.email = 'Enter a valid email address.';
      } else {
        const domain = match[2].toLowerCase();
        const parts = domain.split('.').filter(Boolean);
        const tld = parts.at(-1) ?? '';
        const sld = parts.length >= 2 ? parts.at(-2) ?? '' : '';

        if (parts.length < 2 || tld.length < 2 || sld.length < 2) {
          nextErrors.email = 'Enter a valid email address.';
        }
      }
    }

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = 'Phone Number is required.';
    } else {
      const digits = formData.phoneNumber.replace(/\D/g, '');
      if (digits.length < 10) nextErrors.phoneNumber = 'Enter a valid phone number.';
    }

    return nextErrors;
  }, [formData.email, formData.fullName, formData.phoneNumber]);

  const isValid = Object.keys(errors).length === 0;

  const handleNext = () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <FormSection title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <TextInput 
            label="Full Name" 
            placeholder="e.g. Lauris Bawar" 
            name="fullName" 
            value={formData.fullName} 
            onChange={onInputChange} 
            required 
            error={showErrors ? errors.fullName : undefined}
          />
          <TextInput 
            label="Email" 
            type="email" 
            placeholder="e.g. example@yahoo.com" 
            name="email" 
            value={formData.email} 
            onChange={onInputChange} 
            required 
            error={showErrors ? errors.email : undefined}
          />
          <TextInput 
            label="Phone Number" 
            placeholder="e.g. 0912 345 6789" 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={onInputChange} 
            required 
            error={showErrors ? errors.phoneNumber : undefined}
          />
          <TextInput 
            label="Company / Organization" 
            optional 
            placeholder="e.g. Studio Amihan" 
            name="companyName" 
            value={formData.companyName} 
            onChange={onInputChange} 
          />
          <div className="md:col-span-2">
            <TextInput 
              label="Role / Position" 
              optional 
              placeholder="e.g. Founder / Operations Manager" 
              name="rolePosition" 
              value={formData.rolePosition} 
              onChange={onInputChange} 
            />
          </div>
        </div>
        <div className="flex justify-end mt-12">
          <button 
            type="button"
            onClick={handleNext}
            disabled={!isValid}
            className={`px-12 py-4 bg-[#0ea5e9] text-white font-bold rounded-lg shadow-xl shadow-sky-200 hover:bg-sky-600 active:scale-[0.98] transition-all uppercase tracking-widest text-sm ${!isValid ? 'opacity-60 cursor-not-allowed hover:bg-[#0ea5e9]' : ''}`}
          >
            Next: Selection
          </button>
        </div>
      </FormSection>
    </div>
  );
};

export default StepContactInfo;

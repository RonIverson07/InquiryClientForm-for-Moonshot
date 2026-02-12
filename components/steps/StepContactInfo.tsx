
import React from 'react';
import { ClientFormData } from '../../types';
import { TextInput } from '../Input';
import FormSection from '../FormSection';

interface StepProps {
  formData: ClientFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
}

const StepContactInfo: React.FC<StepProps> = ({ formData, onInputChange, onNext }) => {
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
          />
          <TextInput 
            label="Email" 
            type="email" 
            placeholder="e.g. example@yahoo.com" 
            name="email" 
            value={formData.email} 
            onChange={onInputChange} 
            required 
          />
          <TextInput 
            label="Phone Number" 
            placeholder="e.g. 0912 345 6789" 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={onInputChange} 
            required 
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
            onClick={onNext}
            className="px-12 py-4 bg-[#0ea5e9] text-white font-bold rounded-lg shadow-xl shadow-sky-200 hover:bg-sky-600 active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
          >
            Next: Selection
          </button>
        </div>
      </FormSection>
    </div>
  );
};

export default StepContactInfo;

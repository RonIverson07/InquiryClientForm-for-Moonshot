
import React from 'react';
import { ClientFormData, FormStatus } from '../../types';
import { TextInput, Checkbox, RadioGroup } from '../Input';
import FormSection from '../FormSection';

interface StepProps {
  formData: ClientFormData;
  status: FormStatus;
  onReferralToggle: (source: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const StepReferral: React.FC<StepProps> = ({ formData, status, onReferralToggle, onInputChange, onPrev, onSubmit }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <FormSection title="Referral & Communication">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-6">How did you hear about us?</p>
            <div className="grid grid-cols-2 gap-y-6">
              <Checkbox label="Walk-in" checked={formData.referralSource.includes('Walk-in')} onChange={() => onReferralToggle('Walk-in')} />
              <Checkbox label="Website" checked={formData.referralSource.includes('Website')} onChange={() => onReferralToggle('Website')} />
              <Checkbox label="Friend/Referral" checked={formData.referralSource.includes('Friend/Referral')} onChange={() => onReferralToggle('Friend/Referral')} />
              <Checkbox label="Events/Seminar" checked={formData.referralSource.includes('Events/Seminar')} onChange={() => onReferralToggle('Events/Seminar')} />
              <Checkbox label="Social Media" checked={formData.referralSource.includes('Social Media')} onChange={() => onReferralToggle('Social Media')} />
              <div className="flex items-center space-x-2">
                <Checkbox label="Other" checked={formData.referralSource.includes('Other')} onChange={() => onReferralToggle('Other')} />
              </div>
            </div>
            {formData.referralSource.includes('Other') && (
              <input 
                type="text" 
                name="otherReferralSource" 
                placeholder="Please specify..." 
                value={formData.otherReferralSource} 
                onChange={onInputChange} 
                className="mt-6 w-full px-4 py-2 text-sm bg-slate-50 border-b-2 border-slate-200 focus:border-[#0ea5e9] outline-none text-slate-900 transition-colors" 
              />
            )}
          </div>

          <div className="space-y-10">
            <RadioGroup 
              label="Preferred Contact Method" 
              options={["Email", "Phone", "Messenger"]} 
              value={formData.preferredContact} 
              onChange={(val) => onInputChange({ target: { name: 'preferredContact', value: val } } as any)} 
            />
            <TextInput 
              label="Best Time to Reach You" 
              placeholder="e.g. 2 PM, Morning, Anytime" 
              name="bestTimeToReach" 
              value={formData.bestTimeToReach} 
              onChange={onInputChange} 
            />
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
            onClick={onSubmit}
            disabled={status === FormStatus.SUBMITTING}
            className={`px-10 py-4 bg-[#0ea5e9] text-white font-bold rounded-lg shadow-xl shadow-sky-200 hover:bg-sky-600 active:scale-[0.98] transition-all flex items-center space-x-3 uppercase tracking-widest text-sm ${status === FormStatus.SUBMITTING ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {status === FormStatus.SUBMITTING ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Complete Registration</span>
            )}
          </button>
        </div>
      </FormSection>
    </div>
  );
};

export default StepReferral;

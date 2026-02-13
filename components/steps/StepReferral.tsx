
import React, { useMemo, useState } from 'react';
import { ClientFormData, FormStatus } from '../../types';
import { TextInput, Checkbox, RadioGroup, SelectInput } from '../Input';
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
  const [showErrors, setShowErrors] = useState(false);

  const bestTimeOptions = [
    { value: 'Anytime', label: 'Anytime' },
    { value: 'Morning (8:00 AM – 12:00 PM)', label: 'Morning (8:00 AM – 12:00 PM)' },
    { value: 'Afternoon (12:00 PM – 5:00 PM)', label: 'Afternoon (12:00 PM – 5:00 PM)' },
    { value: 'Evening (5:00 PM – 8:00 PM)', label: 'Evening (5:00 PM – 8:00 PM)' },
    { value: 'Weekdays Only', label: 'Weekdays Only' },
    { value: 'Weekends Only', label: 'Weekends Only' },
  ];

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<'referralSource' | 'preferredContact' | 'bestTimeToReach' | 'otherReferralSource', string>> = {};

    if (!formData.referralSource.length) {
      nextErrors.referralSource = 'Please select at least one referral source.';
    }

    if (!formData.preferredContact.trim()) {
      nextErrors.preferredContact = 'Preferred Contact Method is required.';
    }

    if (!formData.bestTimeToReach.trim()) {
      nextErrors.bestTimeToReach = 'Best Time to Reach You is required.';
    }

    if (formData.referralSource.includes('Other') && !formData.otherReferralSource?.trim()) {
      nextErrors.otherReferralSource = 'Please specify the referral source.';
    }

    return nextErrors;
  }, [formData.bestTimeToReach, formData.otherReferralSource, formData.referralSource]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    if (!isValid) {
      e.preventDefault();
      setShowErrors(true);
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <FormSection title="Referral & Communication">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-6">
              How did you hear about us?
              <span className="text-red-500"> *</span>
            </p>
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
            {showErrors && errors.referralSource && (
              <p className="mt-4 text-xs text-red-600">{errors.referralSource}</p>
            )}
            {formData.referralSource.includes('Other') && (
              <>
                <input 
                  type="text" 
                  name="otherReferralSource" 
                  placeholder="Please specify..." 
                  value={formData.otherReferralSource} 
                  onChange={onInputChange} 
                  className="mt-6 w-full px-4 py-2 text-sm bg-slate-50 border-b-2 border-slate-200 focus:border-[#0ea5e9] outline-none text-slate-900 transition-colors" 
                />
                {showErrors && errors.otherReferralSource && (
                  <p className="mt-2 text-xs text-red-600">{errors.otherReferralSource}</p>
                )}
              </>
            )}
          </div>

          <div className="space-y-10">
            <RadioGroup 
              label="Preferred Contact Method" 
              options={["Email", "Phone", "Messenger"]} 
              value={formData.preferredContact} 
              onChange={(val) => onInputChange({ target: { name: 'preferredContact', value: val } } as any)} 
              required
            />
            {showErrors && errors.preferredContact && (
              <p className="-mt-6 text-xs text-red-600">{errors.preferredContact}</p>
            )}
            <div>
              <SelectInput
                label="Best Time to Reach You"
                name="bestTimeToReach"
                value={formData.bestTimeToReach}
                onChange={onInputChange as any}
                options={bestTimeOptions}
                required
                placeholder="Select an option"
              />
              {showErrors && errors.bestTimeToReach && (
                <p className="mt-2 text-xs text-red-600">{errors.bestTimeToReach}</p>
              )}
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
            onClick={handleSubmit}
            disabled={status === FormStatus.SUBMITTING || !isValid}
            className={`px-10 py-4 bg-[#0ea5e9] text-white font-bold rounded-lg shadow-xl shadow-sky-200 hover:bg-sky-600 active:scale-[0.98] transition-all flex items-center space-x-3 uppercase tracking-widest text-sm ${(status === FormStatus.SUBMITTING || !isValid) ? 'opacity-70 cursor-not-allowed hover:bg-[#0ea5e9]' : ''}`}
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

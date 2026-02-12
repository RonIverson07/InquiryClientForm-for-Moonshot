
import React from 'react';
import { ClientFormData } from '../../types';
import { TextInput, RadioGroup, SelectInput } from '../Input';
import FormSection from '../FormSection';

interface StepProps {
  formData: ClientFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepSpecificDetails: React.FC<StepProps> = ({ formData, onInputChange, onNext, onPrev }) => {
  const teamSizeOptions = [
    { value: '1', label: '1 (Individual)' },
    { value: '2-5', label: '2-5 members' },
    { value: '6-10', label: '6-10 members' },
    { value: '11-20', label: '11-20 members' },
    { value: '20+', label: '20+ members' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <FormSection title="Service-Specific Details (Optional)">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coworking/Virtual Office */}
          <div className="space-y-8 flex flex-col">
            <h3 className="bg-sky-50 text-[#0ea5e9] font-black text-[10px] uppercase tracking-[0.2em] p-4 text-center rounded-lg border border-sky-100 min-h-[4rem] flex items-center justify-center leading-tight">
              Coworking / Virtual Office
            </h3>
            <div className="space-y-8 px-1">
              <RadioGroup 
                label="Preferred Duration" 
                options={["One-time", "1-3 months", "6+ months"]} 
                value={formData.officeDuration} 
                onChange={(val) => onInputChange({ target: { name: 'officeDuration', value: val } } as any)} 
              />
              <SelectInput 
                label="Team Size" 
                placeholder="Number of members" 
                name="teamSize" 
                value={formData.teamSize} 
                onChange={onInputChange} 
                options={teamSizeOptions}
              />
            </div>
          </div>

          {/* Event Space */}
          <div className="space-y-8 flex flex-col">
            <h3 className="bg-sky-50 text-[#0ea5e9] font-black text-[10px] uppercase tracking-[0.2em] p-4 text-center rounded-lg border border-sky-100 min-h-[4rem] flex items-center justify-center leading-tight">
              Event Space
            </h3>
            <div className="space-y-8 px-1">
              <TextInput label="Type of Event" placeholder="e.g. Workshop, Seminar" name="eventType" value={formData.eventType} onChange={onInputChange} />
              <TextInput label="Expected Attendees" placeholder="e.g. 50-100" name="expectedAttendees" value={formData.expectedAttendees} onChange={onInputChange} />
              <TextInput label="Preferred Date" type="date" name="preferredDate" value={formData.preferredDate} onChange={onInputChange} />
            </div>
          </div>

          {/* AI / Software */}
          <div className="space-y-8 flex flex-col">
            <h3 className="bg-sky-50 text-[#0ea5e9] font-black text-[10px] uppercase tracking-[0.2em] p-4 text-center rounded-lg border border-sky-100 min-h-[4rem] flex items-center justify-center leading-tight">
              AI / Software / Web Hosting
            </h3>
            <div className="space-y-8 px-1">
              <RadioGroup 
                label="Do you currently use any tools?" 
                options={["Yes", "No"]} 
                value={formData.currentlyUsingTools === 'yes' ? 'Yes' : formData.currentlyUsingTools === 'no' ? 'No' : ''} 
                onChange={(val) => onInputChange({ target: { name: 'currentlyUsingTools', value: val.toLowerCase() } } as any)} 
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-slate-700">Main challenge to solve</label>
                <textarea 
                  rows={4} 
                  name="mainChallenge" 
                  value={formData.mainChallenge} 
                  onChange={onInputChange} 
                  className="text-slate-900 px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all outline-none resize-none" 
                  placeholder="Briefly explain..." 
                />
              </div>
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
            onClick={onNext}
            className="px-12 py-4 bg-[#0ea5e9] text-white font-bold rounded-lg shadow-xl shadow-sky-200 hover:bg-sky-600 transition-all uppercase tracking-widest text-sm"
          >
            Next: Referral
          </button>
        </div>
      </FormSection>
    </div>
  );
};

export default StepSpecificDetails;

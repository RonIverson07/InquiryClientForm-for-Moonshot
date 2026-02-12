
import React, { useState } from 'react';
import { ClientFormData, MOCK_SUBMISSIONS } from '../types';
import FormSection from '../components/FormSection';
import { TextInput, Checkbox, RadioGroup, SelectInput } from '../components/Input';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [selectedSub, setSelectedSub] = useState<ClientFormData>(MOCK_SUBMISSIONS[0]);
  const packages = [
    "Virtual Office Package — ₱1,999 / month",
    "Co-working Space Standard — ₱4,999 / month",
    "Co-working Space Premium — ₱6,999 / month",
    "StartupLab Pro — ₱9,999 / month"
  ];

  const teamSizeOptions = [
    { value: '1', label: '1 (Individual)' },
    { value: '2-5', label: '2-5 members' },
    { value: '6-10', label: '6-10 members' },
    { value: '11-20', label: '11-20 members' },
    { value: '20+', label: '20+ members' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-3 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-[#0ea5e9] text-white p-1.5 rounded-lg font-bold text-lg">SL</div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight uppercase">Admin Console</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Live Management Mode</span>
          <button 
            onClick={onLogout}
            className="px-5 py-2 bg-slate-900 text-white rounded-md text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg"
          >
            Log Out
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto flex flex-col shadow-inner">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">User Submissions</h3>
          </div>
          <div className="flex-grow">
            {MOCK_SUBMISSIONS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSub(sub)}
                className={`w-full text-left p-5 border-b border-slate-50 transition-all relative ${
                  selectedSub.id === sub.id ? 'bg-sky-50' : 'hover:bg-slate-50'
                }`}
              >
                {selectedSub.id === sub.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0ea5e9]" />
                )}
                <p className="font-bold text-slate-800 text-sm">{sub.fullName}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{sub.email}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">{sub.submittedAt}</span>
                  <span className="text-[8px] bg-[#0ea5e9]/10 text-[#0ea5e9] px-1.5 py-0.5 rounded font-black uppercase">Active</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-grow overflow-y-auto p-12 bg-slate-50/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200/60">
              <div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Submission Data</h2>
                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Reviewing details for: <span className="text-[#0ea5e9]">{selectedSub.fullName}</span></p>
              </div>
              <div className="flex space-x-2">
                <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">Verified</span>
                <button className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Action Item</button>
              </div>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* CONTACT INFORMATION - MIRRORING FORM LAYOUT */}
              <FormSection title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <TextInput label="Full Name" value={selectedSub.fullName} readOnly disabled />
                  <TextInput label="Email" value={selectedSub.email} readOnly disabled />
                  <TextInput label="Phone Number" value={selectedSub.phoneNumber} readOnly disabled />
                  <TextInput label="Company / Organization" value={selectedSub.companyName || ''} optional readOnly disabled />
                  <div className="md:col-span-2">
                    <TextInput label="Role / Position" value={selectedSub.rolePosition || ''} optional readOnly disabled />
                  </div>
                </div>
              </FormSection>

              {/* SERVICES - MIRRORING FORM LAYOUT */}
              <FormSection title="Services">
                <p className="text-slate-500 text-sm mb-6 font-medium">Services you're interested in (check all that apply)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 mb-12">
                  <Checkbox label="AI Workflow & Automation" checked={selectedSub.services.aiWorkflowAutomation} disabled />
                  <Checkbox label="Website Design & Development" checked={selectedSub.services.websiteDesignDevelopment} disabled />
                  <Checkbox label="Software Development (web apps, internal systems, custom solutions)" checked={selectedSub.services.softwareDevelopment} disabled />
                  <Checkbox label="Digital Marketing & Growth Campaigns" checked={selectedSub.services.digitalMarketingGrowth} disabled />
                  <Checkbox label="Bookkeeping & Accounting Services" checked={selectedSub.services.bookkeepingAccounting} disabled />
                  <Checkbox label="HR & Payroll Management" checked={selectedSub.services.hrPayrollManagement} disabled />
                  <Checkbox label="Business Mentorship & Strategic Consultation" checked={selectedSub.services.businessMentorshipConsultation} disabled />
                </div>
                
                <div className="space-y-10">
                  <div className="flex flex-col space-y-4">
                    <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Needs & Goals (Optional)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {packages.map((pkg) => (
                        <div key={pkg} className={`flex items-center p-4 rounded-xl border-2 transition-all ${selectedSub.selectedPackage === pkg ? 'border-[#0ea5e9] bg-sky-50' : 'border-slate-100 bg-white opacity-60'}`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${selectedSub.selectedPackage === pkg ? 'border-[#0ea5e9]' : 'border-slate-300'}`}>
                            {selectedSub.selectedPackage === pkg && <div className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]" />}
                          </div>
                          <span className={`text-sm font-semibold ${selectedSub.selectedPackage === pkg ? 'text-[#0ea5e9]' : 'text-slate-400'}`}>
                            {pkg}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* SERVICE-SPECIFIC DETAILS - MIRRORING FORM LAYOUT */}
              <FormSection title="Service-Specific Details (Optional)">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="space-y-6 flex flex-col">
                    <h3 className="bg-sky-50 text-[#0ea5e9] font-bold text-xs uppercase tracking-widest p-4 text-center rounded-md border border-sky-100 min-h-[4rem] flex items-center justify-center leading-tight">
                      Coworking / Virtual Office
                    </h3>
                    <div className="space-y-6 px-1">
                      <RadioGroup 
                        label="Preferred Duration" 
                        options={["One-time", "1-3 months", "6+ months"]} 
                        value={selectedSub.officeDuration} 
                        disabled 
                      />
                      <SelectInput 
                        label="Team Size" 
                        value={selectedSub.teamSize || ''} 
                        readOnly 
                        disabled 
                        options={teamSizeOptions}
                      />
                    </div>
                  </div>
                  <div className="space-y-6 flex flex-col">
                    <h3 className="bg-sky-50 text-[#0ea5e9] font-bold text-xs uppercase tracking-widest p-4 text-center rounded-md border border-sky-100 min-h-[4rem] flex items-center justify-center leading-tight">
                      Event Space
                    </h3>
                    <div className="space-y-6 px-1">
                      <TextInput label="Type of Event" value={selectedSub.eventType || ''} readOnly disabled />
                      <TextInput label="Expected Attendees" value={selectedSub.expectedAttendees || ''} readOnly disabled />
                      <TextInput label="Preferred Date" type="date" value={selectedSub.preferredDate || ''} readOnly disabled />
                    </div>
                  </div>
                  <div className="space-y-6 flex flex-col">
                    <h3 className="bg-sky-50 text-[#0ea5e9] font-bold text-xs uppercase tracking-widest p-4 text-center rounded-md border border-sky-100 min-h-[4rem] flex items-center justify-center leading-tight">
                      AI / Software / Web Hosting
                    </h3>
                    <div className="space-y-6 px-1">
                      <RadioGroup 
                        label="Do you currently use any tools?" 
                        options={["Yes", "No"]} 
                        value={selectedSub.currentlyUsingTools === 'yes' ? 'Yes' : selectedSub.currentlyUsingTools === 'no' ? 'No' : ''} 
                        disabled 
                      />
                      <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-slate-700">Main challenge to solve</label>
                        <textarea 
                          rows={3} 
                          value={selectedSub.mainChallenge || ''} 
                          readOnly 
                          disabled 
                          className="text-slate-900 px-4 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none resize-none cursor-default"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* REFERRAL & COMMUNICATION - MIRRORING FORM LAYOUT */}
              <FormSection title="Referral & Communication">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-4">How did they hear about us?</p>
                    <div className="grid grid-cols-2 gap-y-4">
                      <Checkbox label="Walk-in" checked={selectedSub.referralSource.includes('Walk-in')} disabled />
                      <Checkbox label="Website" checked={selectedSub.referralSource.includes('Website')} disabled />
                      <Checkbox label="Friend/Referral" checked={selectedSub.referralSource.includes('Friend/Referral')} disabled />
                      <Checkbox label="Events/Seminar" checked={selectedSub.referralSource.includes('Events/Seminar')} disabled />
                      <Checkbox label="Social Media" checked={selectedSub.referralSource.includes('Social Media')} disabled />
                      <div className="flex flex-col">
                        <Checkbox label="Other" checked={selectedSub.referralSource.includes('Other')} disabled />
                        {selectedSub.referralSource.includes('Other') && (
                          <p className="mt-2 text-xs font-bold text-[#0ea5e9] border-b border-sky-100 pb-1">{selectedSub.otherReferralSource}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <RadioGroup 
                      label="Preferred Contact Method" 
                      options={["Email", "Phone", "Messenger"]} 
                      value={selectedSub.preferredContact} 
                      disabled 
                    />
                    <TextInput label="Best Time to Reach" value={selectedSub.bestTimeToReach} readOnly disabled />
                  </div>
                </div>
              </FormSection>
              
              <div className="mb-20 pt-10 border-t border-slate-100 flex items-center justify-center space-x-6">
                <button className="text-[#0ea5e9] text-[10px] font-black uppercase tracking-widest hover:text-sky-700 transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg>
                  <span>Export JSON</span>
                </button>
                <button className="text-[#0ea5e9] text-[10px] font-black uppercase tracking-widest hover:text-sky-700 transition-colors flex items-center space-x-2">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth={2}/></svg>
                  <span>Print Report</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

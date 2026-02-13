
import React, { useEffect, useRef, useState } from 'react';
import { ClientFormData } from '../types';
import FormSection from '../components/FormSection';
import { TextInput, Checkbox, RadioGroup, SelectInput } from '../components/Input';
import { deleteIntakeSubmission, listIntakeSubmissions } from '../services/intakeSubmissions';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState<ClientFormData[]>([]);
  const [selectedSub, setSelectedSub] = useState<ClientFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const submissionPdfRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listIntakeSubmissions();
        if (cancelled) return;
        setSubmissions(data);
        setSelectedSub((prev) => prev ?? data[0] ?? null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load submissions');
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
  const packages = [
    "Virtual Office Package — ₱1,999 / month",
    "Co-working Space Standard — ₱4,999 / month",
    "Co-working Space Premium — ₱6,999 / month",
    "StartupLab Pro — ₱9,999 / month"
  ];

  const teamSizeOptions = [
    { value: '1', label: 'Solo (1 member)' },
    { value: '2-5', label: '2–5 members' },
    { value: '6-10', label: '6–10 members' },
    { value: '11-20', label: '11–20 members' },
    { value: '21-50', label: '21–50 members' },
    { value: '51-100', label: '51–100 members' },
    { value: '100+', label: '100+ members' },
  ];

  const handleDeleteSelected = async () => {
    if (!selectedSub?.id) return;
    const ok = window.confirm('Delete this submission? This cannot be undone.');
    if (!ok) return;

    try {
      setDeleting(true);
      setError(null);
      await deleteIntakeSubmission(selectedSub.id);

      setSubmissions((prev) => {
        const next = prev.filter((s) => s.id !== selectedSub.id);
        setSelectedSub((current) => {
          if (!current?.id) return current;
          if (current.id !== selectedSub.id) return current;
          return next[0] ?? null;
        });
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete submission');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveAsPdf = async () => {
    if (!selectedSub?.id) return;
    const el = submissionPdfRef.current;
    if (!el) return;

    try {
      setExportingPdf(true);
      setError(null);

      if (document?.fonts?.ready) {
        await document.fonts.ready;
      }

      const rect = el.getBoundingClientRect();
      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '0';
      wrapper.style.top = '0';
      wrapper.style.width = `${Math.ceil(rect.width)}px`;
      wrapper.style.background = '#ffffff';
      wrapper.style.zIndex = '-1';
      wrapper.style.opacity = '0';
      wrapper.style.pointerEvents = 'none';

      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const addCanvasToPdf = (canvas: HTMLCanvasElement, opts: { startNewPage: boolean }) => {
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const imgData = canvas.toDataURL('image/png');
        let heightLeft = imgHeight;
        let position = margin;

        if (opts.startNewPage) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;

        while (heightLeft > 0) {
          pdf.addPage();
          position = margin - (imgHeight - heightLeft);
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          heightLeft -= pageHeight - margin * 2;
        }
      };

      const captureNode = async (node: HTMLElement) => {
        const canvas = await html2canvas(node, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
        });
        return canvas;
      };

      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.width = `${Math.ceil(rect.width)}px`;
      clone.style.maxWidth = `${Math.ceil(rect.width)}px`;
      clone.style.background = '#ffffff';
      clone.style.padding = '24px';

      const labelEls = Array.from(clone.querySelectorAll('label'));
      const bestTimeLabel = labelEls.find((n) => (n.textContent || '').trim() === 'Best Time to Reach');
      const bestTimeInput = bestTimeLabel?.parentElement?.querySelector('input') as HTMLInputElement | null;
      if (bestTimeInput) {
        const replacement = document.createElement('div');
        replacement.textContent = bestTimeInput.value;
        replacement.style.boxSizing = 'border-box';
        replacement.style.width = '100%';
        replacement.style.color = '#0f172a';
        replacement.style.background = '#f8fafc';
        replacement.style.border = '1px solid #e2e8f0';
        replacement.style.borderRadius = '0.375rem';
        replacement.style.paddingLeft = '1rem';
        replacement.style.paddingRight = '1rem';
        replacement.style.paddingTop = '0.7rem';
        replacement.style.paddingBottom = '0.7rem';
        replacement.style.fontSize = '1rem';
        replacement.style.lineHeight = '1.5rem';

        bestTimeInput.replaceWith(replacement);
      }

      const sections = Array.from(clone.querySelectorAll('[data-pdf-section]')) as HTMLElement[];
      const page1 = document.createElement('div');
      page1.style.width = `${Math.ceil(rect.width)}px`;
      page1.style.maxWidth = `${Math.ceil(rect.width)}px`;
      page1.style.background = '#ffffff';

      const page2 = document.createElement('div');
      page2.style.width = `${Math.ceil(rect.width)}px`;
      page2.style.maxWidth = `${Math.ceil(rect.width)}px`;
      page2.style.background = '#ffffff';

      const page1Keys = new Set(['contact', 'services']);
      for (const section of sections) {
        const key = section.getAttribute('data-pdf-section') || '';
        if (page1Keys.has(key)) {
          page1.appendChild(section);
        } else {
          page2.appendChild(section);
        }
      }

      wrapper.appendChild(page1);
      wrapper.appendChild(page2);
      document.body.appendChild(wrapper);

      const canvas1 = await captureNode(page1);
      const canvas2 = await captureNode(page2);

      document.body.removeChild(wrapper);

      addCanvasToPdf(canvas1, { startNewPage: false });
      addCanvasToPdf(canvas2, { startNewPage: true });

      const safeName = (selectedSub.fullName || 'submission')
        .trim()
        .replace(/[^a-z0-9\-_. ]/gi, '')
        .replace(/\s+/g, '_');
      pdf.save(`submission_${safeName}_${selectedSub.id}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export PDF');
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-3 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.jpg"
            alt="StartupLab"
            className="h-10 w-10 rounded-lg object-contain bg-white"
          />
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
            {loading && (
              <div className="p-5 text-xs text-slate-500">Loading submissions...</div>
            )}
            {!loading && error && (
              <div className="p-5 text-xs text-red-600 break-words">{error}</div>
            )}
            {!loading && !error && submissions.length === 0 && (
              <div className="p-5 text-xs text-slate-500">No submissions yet.</div>
            )}

            {!loading && !error && submissions.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSub(sub)}
                className={`w-full text-left p-5 border-b border-slate-50 transition-all relative ${
                  selectedSub?.id === sub.id ? 'bg-sky-50' : 'hover:bg-slate-50'
                }`}
              >
                {selectedSub?.id === sub.id && (
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
                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Reviewing details for: <span className="text-[#0ea5e9]">{selectedSub?.fullName ?? '—'}</span></p>
              </div>
              <div className="flex space-x-2">
                <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">Verified</span>
                <button
                  type="button"
                  disabled={!selectedSub?.id || exportingPdf}
                  onClick={handleSaveAsPdf}
                  className={`bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all ${(!selectedSub?.id || exportingPdf) ? 'opacity-60 cursor-not-allowed hover:bg-white' : ''}`}
                >
                  {exportingPdf ? 'Saving…' : 'Save as PDF'}
                </button>
                <button
                  type="button"
                  disabled={!selectedSub?.id || deleting}
                  onClick={handleDeleteSelected}
                  className={`bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all ${(!selectedSub?.id || deleting) ? 'opacity-60 cursor-not-allowed hover:bg-red-50' : ''}`}
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>

            {!selectedSub && !loading && !error && (
              <div className="text-sm text-slate-500">Select a submission from the left.</div>
            )}

            {selectedSub && (
            <div ref={submissionPdfRef} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* CONTACT INFORMATION - MIRRORING FORM LAYOUT */}
              <div data-pdf-section="contact">
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
              </div>

              {/* SERVICES - MIRRORING FORM LAYOUT */}
              <div data-pdf-section="services">
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
              </div>

              {/* SERVICE-SPECIFIC DETAILS - MIRRORING FORM LAYOUT */}
              <div data-pdf-section="specific-details">
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
                      <div className="flex flex-col space-y-2">
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
              </div>

              {/* REFERRAL & COMMUNICATION - MIRRORING FORM LAYOUT */}
              <div data-pdf-section="referral">
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
              </div>
              
            </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

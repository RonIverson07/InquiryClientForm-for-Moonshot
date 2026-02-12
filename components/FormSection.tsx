
import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`mb-12 overflow-hidden bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}>
      <div className="bg-[#0ea5e9] px-6 py-3">
        <h2 className="text-white font-semibold tracking-wide uppercase text-sm">
          {title}
        </h2>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export default FormSection;


import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
}

export const TextInput: React.FC<InputProps> = ({ label, optional, className = "", ...props }) => {
  const showRequired = !!props.required && !optional;

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-slate-700">
        {label}
        {showRequired && <span className="text-red-500"> *</span>}
        {optional && <span className="text-slate-400 font-normal"> (Optional)</span>}
      </label>
      <input
        {...props}
        className={`text-slate-900 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all outline-none ${props.disabled ? 'cursor-default opacity-80' : ''} ${props.type === 'date' ? '[color-scheme:light] text-black' : ''}`}
      />
    </div>
  );
};

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  optional?: boolean;
  // placeholder and readOnly are not native to HTML select, so we add them here to support common UI patterns
  placeholder?: string;
  readOnly?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({ 
  label, 
  options, 
  optional, 
  className = "", 
  placeholder,
  readOnly,
  ...props 
}) => {
  // Combine native disabled with our custom readOnly prop as select doesn't support readOnly
  const isSelectDisabled = props.disabled || readOnly;
  const showRequired = !!props.required && !optional;

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-slate-700">
        {label}
        {showRequired && <span className="text-red-500"> *</span>}
        {optional && <span className="text-slate-400 font-normal"> (Optional)</span>}
      </label>
      <select
        {...props}
        disabled={isSelectDisabled}
        className={`text-slate-900 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat ${isSelectDisabled ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
      >
        <option value="" disabled>{placeholder || 'Select an option'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, disabled }) => {
  return (
    <label className={`flex items-start space-x-3 py-px group ${disabled ? 'cursor-default' : 'cursor-pointer'}`}>
      <div 
        className={`w-6 h-6 mt-0.5 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${
          checked ? 'bg-[#0ea5e9] border-[#0ea5e9]' : 'bg-white border-slate-300'
        } ${!disabled ? 'group-hover:border-[#0ea5e9]' : ''}`}
        onClick={(e) => {
          if (disabled) return;
          e.preventDefault();
          onChange?.(!checked);
        }}
      >
        {checked && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm font-medium leading-5 transition-colors select-none ${checked ? 'text-slate-900' : 'text-slate-500'} ${!disabled ? 'group-hover:text-slate-900' : ''}`}>
        {label}
      </span>
    </label>
  );
};

export const RadioGroup: React.FC<{
  label: string;
  options: string[];
  value: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  required?: boolean;
  optional?: boolean;
}> = ({ label, options, value, onChange, disabled, required, optional }) => {
  const showRequired = !!required && !optional;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">
        {label}
        {showRequired && <span className="text-red-500"> *</span>}
        {optional && <span className="text-slate-400 font-normal"> (Optional)</span>}
      </p>
      <div className="flex flex-wrap gap-6">
        {options.map((opt) => (
          <label key={opt} className={`flex items-start space-x-3 py-px group ${disabled ? 'cursor-default' : 'cursor-pointer'}`}>
            <div 
              className={`w-6 h-6 mt-0.5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                value === opt ? 'border-[#0ea5e9]' : 'border-slate-300'
              } ${!disabled ? 'group-hover:border-[#0ea5e9]' : ''}`}
              onClick={() => {
                if (disabled) return;
                onChange?.(opt);
              }}
            >
              {value === opt && <div className="w-3 h-3 rounded-full bg-[#0ea5e9]" />}
            </div>
            <span className={`text-sm leading-6 select-none transition-colors ${value === opt ? 'text-slate-900 font-bold' : 'text-slate-500'} ${!disabled ? 'group-hover:text-slate-900' : ''}`}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

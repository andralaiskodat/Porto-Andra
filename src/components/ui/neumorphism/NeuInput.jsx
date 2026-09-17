import React from 'react';

/**
 * NeuInput - Inset neumorphic input field
 */
export const NeuInput = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  icon: Icon,
  disabled = false,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5 font-poppins">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-neu-secondary ml-1">
          {label} {required && <span className="text-[#F2739E]">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-neu-secondary pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-xl bg-[#E8ECF1] text-neu-primary placeholder-slate-400
            shadow-neu-inset py-3 text-sm transition-all duration-200
            border border-transparent focus:border-[#7C6EF2]/40 focus:ring-2 focus:ring-[#7C6EF2]/20 focus:outline-none
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};

/**
 * NeuTextarea - Inset neumorphic textarea field
 */
export const NeuTextarea = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  rows = 4,
  required = false,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5 font-poppins">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-neu-secondary ml-1">
          {label} {required && <span className="text-[#F2739E]">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full rounded-xl bg-[#E8ECF1] text-neu-primary placeholder-slate-400
          shadow-neu-inset p-4 text-sm transition-all duration-200 resize-y
          border border-transparent focus:border-[#7C6EF2]/40 focus:ring-2 focus:ring-[#7C6EF2]/20 focus:outline-none
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export default NeuInput;

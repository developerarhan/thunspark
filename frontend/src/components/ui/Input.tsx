import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-mono uppercase tracking-wider text-[#A6A6A0]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-[#F5F5F0] placeholder:text-[#6F6F6A] text-sm transition-colors focus:outline-none focus:border-[#FFD21F] ${
          error ? 'border-[#FF6464]' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[#FF6464] font-medium">{error}</span>}
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  id,
  className = '',
  ...props
}: TextareaProps) {
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-mono uppercase tracking-wider text-[#A6A6A0]"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={4}
        className={`w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-[#F5F5F0] placeholder:text-[#6F6F6A] text-sm transition-colors focus:outline-none focus:border-[#FFD21F] ${
          error ? 'border-[#FF6464]' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[#FF6464] font-medium">{error}</span>}
    </div>
  );
}

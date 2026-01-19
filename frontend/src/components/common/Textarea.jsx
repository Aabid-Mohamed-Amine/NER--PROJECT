import React from 'react';

const Textarea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder,
  error,
  required = false,
  rows = 4,
  className = '',
  rtl = false
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        dir={rtl ? 'rtl' : 'ltr'}
        className={`
          block w-full px-4 py-3 border rounded-lg shadow-sm
          focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${rtl ? 'font-arabic' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
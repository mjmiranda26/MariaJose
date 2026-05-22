import React from 'react';
import '../../../styles/componentes/comun/input/input.css';

export default function Input({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  icon: Icon,
  error,
  disabled = false,
  autoComplete = 'off'
}) {
  return (
    <div className="input-container">
      <div className={`input-wrapper ${error ? 'error' : ''}`}>
        {Icon && <Icon className="input-icon" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className="input-field"
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
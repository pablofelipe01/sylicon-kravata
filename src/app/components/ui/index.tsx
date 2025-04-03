"use client";

import React from 'react';

// Tipos para los componentes UI
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  fullWidth?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

type InputProps = {
  id?: string;
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  required?: boolean;
};

type TabProps = {
  label: string;
  value: string;
  onClick: () => void;
  active: boolean;
};

type TabsProps = {
  tabs: { label: string; value: string }[];
  activeTab: string;
  onTabChange: (value: string) => void;
};

// Componente Button
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  type = 'button',
  className = '',
}) => {
  // Mapeo de variantes a clases
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        font-medium py-2 px-4 rounded-md transition-colors 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

// Componente Input
export const Input: React.FC<InputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  className = '',
  error,
  required = false,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          ${error ? 'border-red-500 dark:border-red-500' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

// Componente Tab
export const Tab: React.FC<TabProps> = ({ 
  label, 
  value, 
  onClick, 
  active 
}) => {
  return (
    <button
      className={`py-2 px-3 font-medium text-xs sm:text-sm ${
        active
          ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// Componente Tabs
export const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-4">
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          active={activeTab === tab.value}
          onClick={() => onTabChange(tab.value)}
        />
      ))}
    </div>
  );
};

// Componente Card
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};
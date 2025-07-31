import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  icon?: LucideIcon;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error', 
  message, 
  icon: Icon,
  className = '' 
}) => (
  <div className={`text-center max-w-md ${className}`}>
    {Icon && <Icon className="h-16 w-16 text-red-500 mx-auto mb-4" />}
    <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-600">{message}</p>
  </div>
);

export default ErrorMessage;
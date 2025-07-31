export interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  error,
  className = '',
  maxLength,
  showCharacterCount = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // If maxLength is set, enforce it
    if (maxLength && newValue.length > maxLength) {
      return; // Don't update if exceeding max length
    }
    
    onChange(newValue);
  };

  const isNearLimit = maxLength && value.length >= maxLength * 0.8;
  const isAtLimit = maxLength && value.length >= maxLength;

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {maxLength && showCharacterCount && (
          <span className={`text-xs ${
            isAtLimit ? 'text-red-500' : 
            isNearLimit ? 'text-orange-500' : 
            'text-gray-500'
          }`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          ${isAtLimit ? 'border-orange-300' : ''}
        `}
      />
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      
      {maxLength && !showCharacterCount && (
        <p className={`mt-1 text-xs ${
          isAtLimit ? 'text-red-500' : 
          isNearLimit ? 'text-orange-500' : 
          'text-gray-500'
        }`}>
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
};

export default FormInput;
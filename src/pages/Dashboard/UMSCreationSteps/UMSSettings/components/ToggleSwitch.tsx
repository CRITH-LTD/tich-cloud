
export interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  size?: 'sm' | 'md';
  color?: 'blue' | 'green' | 'red';
  disabled?: boolean;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  size = 'md',
  color = 'blue',
  disabled = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: { container: 'h-5 w-9', thumb: 'h-3 w-3' },
    md: { container: 'h-6 w-11', thumb: 'h-4 w-4' }
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600'
  };

  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`
        relative inline-flex ${sizeClasses[size].container} items-center rounded-full transition-colors
        ${enabled ? colorClasses[color] : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span
        className={`
          inline-block ${sizeClasses[size].thumb} transform rounded-full bg-white transition-transform
          ${enabled ? (size === 'sm' ? 'translate-x-4' : 'translate-x-6') : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
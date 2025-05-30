import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ToggleSwitch = ({ 
  checked = false, 
  onChange, 
  disabled = false, 
  size = 'md', // sm, md, lg
  color = 'blue' // blue, green, red, purple
}) => {
  const { darkMode } = useContext(ThemeContext);

  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      circle: 'h-3 w-3'
    },
    md: {
      switch: 'w-11 h-6',
      circle: 'h-5 w-5'
    },
    lg: {
      switch: 'w-14 h-8',
      circle: 'h-7 w-7'
    }
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  };

  const { switch: switchSize, circle: circleSize } = sizeClasses[size];
  const activeColor = colorClasses[color];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex ${switchSize} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${checked 
          ? activeColor 
          : darkMode 
            ? 'bg-gray-600' 
            : 'bg-gray-200'
        }
      `}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        aria-hidden="true"
        className={`
          ${circleSize} inline-block rounded-full bg-white shadow transform ring-0 
          transition duration-200 ease-in-out
        `}
        style={{
          transform: checked 
            ? size === 'sm' ? 'translateX(16px)' 
              : size === 'lg' ? 'translateX(24px)' 
              : 'translateX(20px)'
            : 'translateX(0)',
        }}
      />
    </button>
  );
};

export default ToggleSwitch;
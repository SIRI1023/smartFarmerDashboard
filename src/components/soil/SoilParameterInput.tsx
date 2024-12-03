import React, { memo } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { SOIL_IDEAL_RANGES } from '../../utils/soilConstants';

interface Props {
  fieldName: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  status: 'optimal' | 'warning' | 'error' | null;
  disabled?: boolean;
}

const SoilParameterInput: React.FC<Props> = memo(({
  fieldName,
  value,
  onChange,
  error,
  status,
  disabled
}) => {
  const key = fieldName === 'ph_level' ? 'ph' : 
              fieldName === 'organic_matter' ? 'organicMatter' : 
              fieldName.replace(/_/g, '');
              
  const range = SOIL_IDEAL_RANGES[key as keyof typeof SOIL_IDEAL_RANGES];
  const label = fieldName === 'ph_level' ? 'pH Level' : 
    fieldName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const unit = fieldName === 'ph_level' ? '' : 
    (fieldName === 'organic_matter' || fieldName === 'moisture') ? ' (%)' : ' (mg/kg)';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{unit}
      </label>
      <div className="relative">
        <input
          type="number"
          name={fieldName}
          step="0.1"
          required
          className={`auth-input pr-10 ${
            status === 'optimal' ? 'border-green-500 focus:border-green-500 focus:ring-green-500' :
            status === 'warning' ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500' :
            status === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          value={value}
          onChange={onChange}
          placeholder="0.0"
          min={fieldName === 'ph_level' ? 0 : 0}
          max={fieldName === 'ph_level' ? 14 : 
            (fieldName === 'organic_matter' || fieldName === 'moisture') ? 100 : undefined}
          disabled={disabled}
        />
        {status && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {status === 'optimal' ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className={`h-4 w-4 ${
                status === 'warning' ? 'text-yellow-500' : 'text-red-500'
              }`} />
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>
      )}
      {range && (
        <p className="mt-1 text-xs text-gray-500">
          Ideal range: {range.min}{unit.replace(/[()]/g, '')} - {range.max}{unit.replace(/[()]/g, '')}
        </p>
      )}
    </div>
  );
});

SoilParameterInput.displayName = 'SoilParameterInput';

export default SoilParameterInput;
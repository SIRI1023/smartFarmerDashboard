import { SOIL_IDEAL_RANGES } from './soilConstants';
import { debounce } from './debounce';

export const formatSoilValue = (value: number, param: string): string => {
  if (param === 'organic_matter' || param === 'moisture') {
    return `${value}%`;
  }
  if (param === 'ph_level') {
    return value.toFixed(1);
  }
  return `${value} mg/kg`;
};

export const getSoilParameterStatus = (param: string, value: number): 'optimal' | 'warning' | 'error' => {
  const key = param === 'ph_level' ? 'ph' : 
             param === 'organic_matter' ? 'organicMatter' : param;
             
  const range = SOIL_IDEAL_RANGES[key as keyof typeof SOIL_IDEAL_RANGES];
  
  if (!range) return 'warning';
  
  if (value < range.min || value > range.max) return 'error';
  if (Math.abs(value - range.min) < 0.1 || Math.abs(value - range.max) < 0.1) return 'warning';
  return 'optimal';
};

export const validateSoilField = debounce((name: string, value: string): string => {
  if (!value || value === '') return '';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'Please enter a valid number';
  
  switch (name) {
    case 'ph_level':
      if (numValue < 0 || numValue > 14) return 'pH must be between 0 and 14';
      break;
    case 'nitrogen':
    case 'phosphorus':
    case 'potassium':
      if (numValue < 0) return 'Value must be positive';
      if (numValue > 1000) return 'Value seems too high';
      break;
    case 'organic_matter':
    case 'moisture':
      if (numValue < 0 || numValue > 100) return 'Percentage must be between 0 and 100';
      break;
  }
  return '';
}, 300);
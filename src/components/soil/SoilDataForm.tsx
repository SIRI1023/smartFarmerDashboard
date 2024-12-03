import React, { useState, useCallback, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Database } from 'lucide-react';
import { generateSoilRecommendations } from '../../utils/soilRecommendations';
import { validateSoilField, getSoilParameterStatus } from '../../utils/soilUtils';
import { SOIL_IDEAL_RANGES, SOIL_TYPES } from '../../utils/soilConstants';
import SoilParameterInput from './SoilParameterInput';

interface SoilFormData {
  location: string;
  ph_level: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organic_matter: string;
  moisture: string;
  soil_type: string;
}

interface Props {
  onSuccess?: () => void;
}

const initialFormData: SoilFormData = {
  location: '',
  ph_level: '',
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  organic_matter: '',
  moisture: '',
  soil_type: '',
};

const SoilDataForm: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<SoilFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof SoilFormData, string>>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name !== 'location' && name !== 'soil_type') {
      const error = validateSoilField(name, value);
      setValidationErrors(prev => ({ ...prev, [name]: error }));
    }
  }, []);

  const getFieldStatus = useCallback((fieldName: keyof SoilFormData) => {
    if (fieldName === 'location' || fieldName === 'soil_type' || !formData[fieldName]) {
      return null;
    }
    const value = parseFloat(formData[fieldName]);
    return isNaN(value) ? 'error' : getSoilParameterStatus(fieldName, value);
  }, [formData]);

  const isFormValid = useMemo(() => {
    return !Object.values(validationErrors).some(error => error) &&
           Object.values(formData).every(value => value !== '') &&
           !loading;
  }, [formData, validationErrors, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    try {
      setLoading(true);
      const loadingToast = toast.loading('Recording soil data...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Convert string values to numbers
      const numericData = {
        ph_level: parseFloat(formData.ph_level),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        organic_matter: parseFloat(formData.organic_matter),
        moisture: parseFloat(formData.moisture),
      };

      // Generate recommendations
      const recommendations = generateSoilRecommendations({
        ...numericData,
        soil_type: formData.soil_type
      });

      // Insert soil data
      const { data: soilData, error: soilError } = await supabase
        .from('soil_data')
        .insert({
          user_id: user.id,
          location: formData.location,
          ...numericData,
          soil_type: formData.soil_type,
          recommendations: recommendations.join(' '),
          recorded_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (soilError) throw soilError;

      toast.dismiss(loadingToast);
      toast.success('Soil data recorded successfully');
      
      setFormData(initialFormData);
      setValidationErrors({});
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('Error recording soil data:', error);
      toast.error(error.message || 'Failed to record soil data');
    } finally {
      setLoading(false);
    }
  };

  const soilParameters = useMemo(() => 
    Object.entries(SOIL_IDEAL_RANGES).map(([key]) => {
      const fieldName = key === 'ph' ? 'ph_level' : key.replace(/([A-Z])/g, '_$1').toLowerCase();
      return fieldName;
    }), 
  []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Record Soil Data</h2>
        <Database className="text-green-500 h-6 w-6" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            required
            className="auth-input"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {soilParameters.map((fieldName) => (
            <SoilParameterInput
              key={fieldName}
              fieldName={fieldName as keyof SoilFormData}
              value={formData[fieldName as keyof SoilFormData]}
              onChange={handleChange}
              error={validationErrors[fieldName as keyof SoilFormData]}
              status={getFieldStatus(fieldName as keyof SoilFormData)}
              disabled={loading}
            />
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Soil Type
          </label>
          <select
            name="soil_type"
            required
            className="auth-input"
            value={formData.soil_type}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select soil type</option>
            {SOIL_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`auth-button ${
            !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Recording...
            </span>
          ) : (
            'Record Data'
          )}
        </button>
      </form>
    </div>
  );
};

export default SoilDataForm;
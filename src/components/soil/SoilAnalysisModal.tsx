import React from 'react';
import { X } from 'lucide-react';
import { SOIL_IDEAL_RANGES } from '../../utils/soilRecommendations';

interface SoilAnalysisModalProps {
  data: {
    location: string;
    ph_level: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organic_matter: number;
    moisture: number;
    soil_type: string;
    recommendations: string;
    recorded_at: string;
  };
  onClose: () => void;
}

const SoilAnalysisModal: React.FC<SoilAnalysisModalProps> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
            <p className="text-sm text-gray-500">
              {new Date(data.recorded_at).toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-lg font-medium">{data.location}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Soil Type</p>
              <p className="text-lg font-medium capitalize">{data.soil_type}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">pH Level</p>
              <p className="text-lg font-medium">{data.ph_level.toFixed(1)}</p>
              <p className="text-xs text-gray-400">
                Ideal range: {SOIL_IDEAL_RANGES.ph.min} - {SOIL_IDEAL_RANGES.ph.max}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Organic Matter</p>
              <p className="text-lg font-medium">{data.organic_matter}%</p>
              <p className="text-xs text-gray-400">
                Ideal range: {SOIL_IDEAL_RANGES.organicMatter.min}% - {SOIL_IDEAL_RANGES.organicMatter.max}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Nitrogen</p>
              <p className="text-lg font-medium">{data.nitrogen} mg/kg</p>
              <p className="text-xs text-gray-400">
                Ideal range: {SOIL_IDEAL_RANGES.nitrogen.min} - {SOIL_IDEAL_RANGES.nitrogen.max} mg/kg
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Phosphorus</p>
              <p className="text-lg font-medium">{data.phosphorus} mg/kg</p>
              <p className="text-xs text-gray-400">
                Ideal range: {SOIL_IDEAL_RANGES.phosphorus.min} - {SOIL_IDEAL_RANGES.phosphorus.max} mg/kg
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Potassium</p>
              <p className="text-lg font-medium">{data.potassium} mg/kg</p>
              <p className="text-xs text-gray-400">
                Ideal range: {SOIL_IDEAL_RANGES.potassium.min} - {SOIL_IDEAL_RANGES.potassium.max} mg/kg
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Moisture</p>
              <p className="text-lg font-medium">{data.moisture}%</p>
              <p className="text-xs text-gray-400">
                Ideal range: {SOIL_IDEAL_RANGES.moisture.min}% - {SOIL_IDEAL_RANGES.moisture.max}%
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <p className="text-sm text-gray-600">{data.recommendations}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysisModal;
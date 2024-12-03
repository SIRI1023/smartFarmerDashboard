import React from 'react';
import { X } from 'lucide-react';
import AnalysisResult from './AnalysisResult';

interface AnalysisModalProps {
  analysis: {
    disease_detected: string;
    confidence: number;
    recommendations: string;
    image_url: string;
    crop_name?: string;
  };
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ analysis, onClose }) => {
  // Convert the database analysis format to match AnalysisResult props
  const formattedAnalysis = {
    disease: analysis.disease_detected,
    confidence: analysis.confidence,
    recommendation: analysis.recommendations,
    imageUrl: analysis.image_url,
    crop_name: analysis.crop_name
  };

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

          <div className="mt-2">
            <AnalysisResult {...formattedAnalysis} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
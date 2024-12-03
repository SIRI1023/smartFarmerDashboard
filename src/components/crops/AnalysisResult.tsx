import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

interface AnalysisResultProps {
  disease: string;
  confidence: number;
  recommendation: string;
  crop_name?: string;
  imageUrl: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  disease,
  confidence,
  recommendation,
  crop_name,
  imageUrl
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
      
      <div className="space-y-4">
        {crop_name && (
          <div>
            <p className="text-sm text-gray-500">Crop Type</p>
            <p className="text-lg font-medium">{crop_name}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500">Disease Detected</p>
          <p className="text-lg font-medium">{disease || 'No disease detected'}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Confidence</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {(confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-start space-x-2">
            {confidence > 0.7 ? (
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">Recommended Action</p>
              <p className="mt-1 text-sm text-gray-500">
                {recommendation || 'No specific recommendations available'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <img 
            src={imageUrl} 
            alt="Analyzed crop" 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
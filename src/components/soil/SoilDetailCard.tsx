import React from 'react';
import { SOIL_IDEAL_RANGES } from '../../utils/soilRecommendations';
import { formatSoilValue, getSoilParameterStatus } from '../../utils/soilUtils';

interface Props {
  paramKey: string;
  value: number;
  range: { min: number; max: number };
}

const SoilDetailCard: React.FC<Props> = ({ paramKey, value, range }) => {
  const status = getSoilParameterStatus(paramKey, value);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          {paramKey.split(/(?=[A-Z])/).join(' ')}
        </span>
        <span className={`text-sm font-medium ${
          status === 'optimal' ? 'text-green-600' :
          status === 'warning' ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {formatSoilValue(value, paramKey)}
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Ideal range: {range.min} - {range.max}
      </div>
    </div>
  );
};

export default SoilDetailCard;
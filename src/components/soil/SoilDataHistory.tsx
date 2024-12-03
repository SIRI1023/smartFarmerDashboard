import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Database, AlertTriangle, Check } from 'lucide-react';
import { SOIL_IDEAL_RANGES } from '../../utils/soilRecommendations';
import { formatSoilValue, getSoilParameterStatus } from '../../utils/soilUtils';

interface SoilRecord {
  id: string;
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
}

interface Props {
  data: SoilRecord[];
  onDataClick: (data: SoilRecord) => void;
}

const SoilDataHistory: React.FC<Props> = ({ data, onDataClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Soil Health Trends</h2>
        <Database className="text-green-500 h-6 w-6" />
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="recorded_at" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number, name: string) => [
                formatSoilValue(value, name),
                name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
              ]}
            />
            <Legend />
            <Line type="monotone" dataKey="ph_level" stroke="#8884d8" name="pH" />
            <Line type="monotone" dataKey="nitrogen" stroke="#82ca9d" name="Nitrogen" />
            <Line type="monotone" dataKey="phosphorus" stroke="#ffc658" name="Phosphorus" />
            <Line type="monotone" dataKey="potassium" stroke="#ff7300" name="Potassium" />
            <Line type="monotone" dataKey="organic_matter" stroke="#0088fe" name="Organic Matter" />
            <Line type="monotone" dataKey="moisture" stroke="#00C49F" name="Moisture" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Measurements</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((record) => {
                const hasWarnings = ['ph_level', 'nitrogen', 'phosphorus', 'potassium', 'organic_matter', 'moisture'].some(
                  param => getSoilParameterStatus(param, record[param as keyof SoilRecord] as number) !== 'optimal'
                );

                return (
                  <tr 
                    key={record.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onDataClick(record)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.recorded_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {hasWarnings ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Needs Attention
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="w-4 h-4 mr-1" />
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 hover:text-green-700">
                      View Details
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SoilDataHistory;
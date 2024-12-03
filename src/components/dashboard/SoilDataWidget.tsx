import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SoilData {
  date: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

const SoilDataWidget: React.FC<{ data: SoilData[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Soil Health Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ph" stroke="#8884d8" name="pH" />
            <Line type="monotone" dataKey="nitrogen" stroke="#82ca9d" name="Nitrogen" />
            <Line type="monotone" dataKey="phosphorus" stroke="#ffc658" name="Phosphorus" />
            <Line type="monotone" dataKey="potassium" stroke="#ff7300" name="Potassium" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SoilDataWidget;
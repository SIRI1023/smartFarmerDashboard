import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatSoilValue } from '../../utils/soilUtils';

interface Props {
  data: any[];
}

const SoilTrendsChart: React.FC<Props> = ({ data }) => {
  return (
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
  );
};

export default SoilTrendsChart;
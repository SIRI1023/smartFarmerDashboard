import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Calendar, Filter, Database, Sprout } from 'lucide-react';
import SoilAnalysisModal from '../components/soil/SoilAnalysisModal';
import AnalysisModal from '../components/crops/AnalysisModal';
import { useDataFetching } from '../hooks/useDataFetching';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface HistoryRecord {
  id: string;
  user_id: string;
  soil_id?: string;
  crop_id?: string;
  recommendation_text: string;
  source: 'soil' | 'crop';
  created_at: string;
  soil_data?: {
    id: string;
    location: string;
    ph_level: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organic_matter: number;
    moisture: number;
    soil_type: string;
    recorded_at: string;
    recommendations: string;
  };
  crop_data?: {
    id: string;
    crop_name: string;
    disease_detected: string;
    confidence: number;
    recommendations: string;
    image_url: string;
    created_at: string;
  };
}

const History = () => {
  const [source, setSource] = useState<'all' | 'soil' | 'crop'>('all');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const { data: soilData, loading: soilLoading } = useDataFetching({
    table: 'soil_data',
    dateRange: {
      column: 'recorded_at',
      range: dateRange
    },
    orderBy: { column: 'recorded_at', ascending: false },
    cacheTime: 60000
  });

  const { data: cropData, loading: cropLoading } = useDataFetching({
    table: 'crops',
    dateRange: {
      column: 'created_at',
      range: dateRange
    },
    orderBy: { column: 'created_at', ascending: false },
    cacheTime: 60000
  });

  const loading = soilLoading || cropLoading;

  const records: HistoryRecord[] = React.useMemo(() => {
    const allRecords = [
      ...(soilData?.map(soil => ({
        id: soil.id,
        user_id: soil.user_id,
        soil_id: soil.id,
        source: 'soil' as const,
        recommendation_text: soil.recommendations || '',
        created_at: soil.recorded_at,
        soil_data: soil
      })) || []),
      ...(cropData?.map(crop => ({
        id: crop.id,
        user_id: crop.user_id,
        crop_id: crop.id,
        source: 'crop' as const,
        recommendation_text: crop.recommendations || '',
        created_at: crop.created_at,
        crop_data: crop
      })) || [])
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return source === 'all' 
      ? allRecords 
      : allRecords.filter(record => record.source === source);
  }, [soilData, cropData, source]);

  const handleRecordClick = (record: HistoryRecord) => {
    setSelectedRecord(record);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
          <div className="text-sm text-gray-500">
            Total Records: {records.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as 'all' | 'soil' | 'crop')}
                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="all">All Sources</option>
                <option value="soil">Soil Analysis</option>
                <option value="crop">Crop Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleRecordClick(record)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {record.source === 'soil' ? (
                        <Database className="h-5 w-5 text-green-600" />
                      ) : (
                        <Sprout className="h-5 w-5 text-green-600" />
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {record.source === 'soil' 
                              ? `Soil Analysis - ${record.soil_data?.location}`
                              : `Crop Analysis - ${record.crop_data?.disease_detected || 'No Disease Detected'}`
                            }
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(record.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{record.recommendation_text}</p>
                      </div>
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No records found</h3>
              <p className="mt-1 text-gray-500">
                Adjust your filters or analyze more crops/soil samples to see recommendations here.
              </p>
            </div>
          )}
        </div>

        {selectedRecord && selectedRecord.source === 'soil' && selectedRecord.soil_data && (
          <SoilAnalysisModal
            data={selectedRecord.soil_data}
            onClose={() => setSelectedRecord(null)}
          />
        )}

        {selectedRecord && selectedRecord.source === 'crop' && selectedRecord.crop_data && (
          <AnalysisModal
            analysis={{
              disease_detected: selectedRecord.crop_data.disease_detected,
              confidence: selectedRecord.crop_data.confidence,
              recommendations: selectedRecord.crop_data.recommendations,
              image_url: selectedRecord.crop_data.image_url,
              crop_name: selectedRecord.crop_data.crop_name
            }}
            onClose={() => setSelectedRecord(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default History;
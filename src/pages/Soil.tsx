import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SoilDataForm from '../components/soil/SoilDataForm';
import SoilDataHistory from '../components/soil/SoilDataHistory';
import SoilAnalysisModal from '../components/soil/SoilAnalysisModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SoilData {
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

const Soil = () => {
  const [soilHistory, setSoilHistory] = useState<SoilData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSoilData, setSelectedSoilData] = useState<SoilData | null>(null);

  const fetchSoilHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
        return;
      }

      const { data, error } = await supabase
        .from('soil_data')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      setSoilHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching soil data:', error);
      toast.error('Failed to load soil history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoilHistory();

    // Set up real-time subscription
    const soilSubscription = supabase
      .channel('soil_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'soil_data'
        },
        () => {
          fetchSoilHistory();
        }
      )
      .subscribe();

    return () => {
      soilSubscription.unsubscribe();
    };
  }, []);

  const handleSoilDataClick = (data: SoilData) => {
    setSelectedSoilData(data);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Soil Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SoilDataForm onSuccess={fetchSoilHistory} />
          <SoilDataHistory 
            data={soilHistory} 
            onDataClick={handleSoilDataClick}
          />
        </div>

        {selectedSoilData && (
          <SoilAnalysisModal
            data={selectedSoilData}
            onClose={() => setSelectedSoilData(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Soil;
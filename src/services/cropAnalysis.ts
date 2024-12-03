import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import toast from 'react-hot-toast';

const AI_ENDPOINT = 'https://smartfarmer-dashboard-621426137412.us-central1.run.app/predict';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RETRIES = 3;
const TIMEOUT = 60000; // 60 seconds

interface AnalysisResult {
  disease: string;
  confidence: number;
  recommendation: string;
  imageUrl: string;
  crop_name?: string;
}

export const analyzeCropImage = async (file: File): Promise<AnalysisResult> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to analyze crops');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB');
  }

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    throw new Error('Only JPEG and PNG images are supported');
  }

  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts < MAX_RETRIES) {
    try {
      // Generate unique filename and path
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `crop-images/${user.id}/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('crop-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('crop-images')
        .getPublicUrl(filePath);

      // Prepare form data for AI analysis
      const formData = new FormData();
      formData.append('image', file);

      // Send to AI service for analysis
      const response = await axios.post(AI_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: TIMEOUT,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          toast.loading(`Analyzing image: ${percentCompleted}%`, { id: 'analysis-progress' });
        }
      });

      toast.dismiss('analysis-progress');

      if (!response.data) {
        throw new Error('No response from AI service');
      }

      // Save analysis results to database
      const { error: insertError } = await supabase
        .from('crops')
        .insert({
          user_id: user.id,
          disease_detected: response.data.disease,
          confidence: response.data.confidence,
          recommendations: response.data.recommendation,
          crop_name: response.data.crop_name || null,
          created_at: new Date().toISOString(),
          image_url: publicUrl,
          file_path: filePath // Store the complete file path
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        // Clean up uploaded file if database insert fails
        await supabase.storage
          .from('crop-images')
          .remove([filePath]);
        throw new Error('Failed to save analysis results');
      }

      return {
        disease: response.data.disease,
        confidence: response.data.confidence,
        recommendation: response.data.recommendation,
        imageUrl: publicUrl,
        crop_name: response.data.crop_name
      };

    } catch (error: any) {
      attempts++;
      lastError = error;
      console.error(`Attempt ${attempts} failed:`, error);

      if (attempts === MAX_RETRIES) {
        throw new Error(lastError?.message || 'Analysis failed after multiple attempts');
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw new Error('Unexpected error during analysis');
};
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  loading?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, loading = false }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    onUpload(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    disabled: loading
  });

  return (
    <div
      {...getRootProps()}
      className={`bg-white rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-500'}
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {loading ? (
        <div className="flex flex-col items-center">
          <Loader className="h-12 w-12 text-green-600 animate-spin" />
          <p className="mt-4 text-sm text-gray-500">
            Processing image... This may take a moment
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Please don't refresh the page
          </p>
        </div>
      ) : (
        <>
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag and drop an image here, or click to select'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: JPEG, PNG (max 5MB)
          </p>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
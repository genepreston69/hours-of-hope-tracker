
import React, { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

interface QuestionPhotoUploadProps {
  questionField: string;
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  label?: string;
}

export const QuestionPhotoUpload: React.FC<QuestionPhotoUploadProps> = ({
  questionField,
  photos,
  onPhotosChange,
  label = "Attach photos for this question"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      alert('Only image files are allowed');
    }
    
    const newPhotos = [...photos, ...imageFiles];
    onPhotosChange(newPhotos);
    
    // Reset the input
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-3 border border-gray-200 rounded-md bg-gray-50">
      <button
        type="button"
        onClick={toggleExpanded}
        className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 flex items-center justify-between"
      >
        <span className="flex items-center">
          <Image className="w-4 h-4 mr-2" />
          {label} {photos.length > 0 && `(${photos.length})`}
        </span>
        <span className="text-xs">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>
      
      {isExpanded && (
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="space-y-3">
            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-2 pb-2">
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Click to upload images</p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>

            {/* Photo Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

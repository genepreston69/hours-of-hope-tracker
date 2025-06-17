
import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhotoUploadProps {
  onPhotosChange: (photos: File[]) => void;
  photos: File[];
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotosChange, photos }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    console.log('PhotoUpload: Handling files', newFiles);
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      const updatedPhotos = [...photos, ...imageFiles];
      console.log('PhotoUpload: Updated photos', updatedPhotos);
      onPhotosChange(updatedPhotos);
    } else if (newFiles.length > 0) {
      alert('Please select only image files (JPG, PNG, GIF, etc.)');
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(updatedPhotos);
  };

  const triggerFileInput = () => {
    const input = document.getElementById('photo-upload');
    if (input) {
      input.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5 text-gray-600" />
        <Label className="text-base font-medium">Attach Photos</Label>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-2">
          Tap here to select photos or drag and drop
        </p>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
          id="photo-upload"
          capture="environment"
        />
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            triggerFileInput();
          }}
        >
          Choose Photos
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Supports JPG, PNG, GIF files
        </p>
      </div>

      {photos.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Attached Photos ({photos.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {photo.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

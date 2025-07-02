import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, Image, Check, AlertCircle } from 'lucide-react';

// Types
type UploadStatus = 'uploading' | 'success' | 'error' | null;

interface LogoUploadProps {
  value?: string | null;
  onChange: ChangeEvent<HTMLInputElement>;
  maxSizeBytes?: number;
  minDimensions?: { width: number; height: number };
  acceptedFormats?: string[];
  required?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

const UMSLogoUpload: React.FC<LogoUploadProps> = ({
  value = null,
  onChange,
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  minDimensions = { width: 256, height: 256 },
  acceptedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  required = true,
  label = "Institution Logo",
  placeholder = "Upload Institution Logo",
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): FileValidationResult => {
    // Validate file type
    if (!acceptedFormats.some(format => file.type === format)) {
      return {
        isValid: false,
        error: `Please select a valid image file (${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')})`
      };
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
      return {
        isValid: false,
        error: `Image size must be less than ${maxSizeMB}MB`
      };
    }

    return { isValid: true };
  };

  const validateImageDimensions = (img: HTMLImageElement): FileValidationResult => {
    if (img.width < minDimensions.width || img.height < minDimensions.height) {
      return {
        isValid: false,
        error: `Image must be at least ${minDimensions.width}×${minDimensions.height} pixels`
      };
    }
    return { isValid: true };
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: File): void => {
    const fileValidation = validateFile(file);
    if (!fileValidation.isValid) {
      setError(fileValidation.error || 'Invalid file');
      setUploadStatus('error');
      return;
    }

    setError('');
    setUploadStatus('uploading');

    // Create image to validate dimensions
    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>): void => {
      const result = e.target?.result;
      if (typeof result !== 'string') {
        setError('Failed to read file');
        setUploadStatus('error');
        return;
      }

      img.onload = (): void => {
        const dimensionValidation = validateImageDimensions(img);
        if (!dimensionValidation.isValid) {
          setError(dimensionValidation.error || 'Invalid dimensions');
          setUploadStatus('error');
          return;
        }

        // Simulate upload delay for better UX
        setTimeout(() => {
          onChange(result);
          setUploadStatus('success');
          
          // Clear success status after 2 seconds
          setTimeout(() => setUploadStatus(null), 2000);
        }, 1000);
      };

      img.onerror = (): void => {
        setError('Failed to process image');
        setUploadStatus('error');
      };

      img.src = result;
    };

    reader.onerror = (): void => {
      setError('Failed to read file');
      setUploadStatus('error');
    };

    reader.readAsDataURL(file);
  };

  const removeImage = (): void => {
    onChange(null);
    setUploadStatus(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const getStatusColor = (): string => {
    switch (uploadStatus) {
      case 'uploading': return 'border-blue-300 bg-blue-50';
      case 'success': return 'border-green-300 bg-green-50';
      case 'error': return 'border-red-300 bg-red-50';
      default: return isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white';
    }
  };

  const getStatusIcon = (): JSX.Element => {
    switch (uploadStatus) {
      case 'uploading': 
        return <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />;
      case 'success': 
        return <Check className="h-6 w-6 text-green-500" />;
      case 'error': 
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default: 
        return <Upload className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusText = (): string => {
    switch (uploadStatus) {
      case 'uploading': return 'Processing...';
      case 'error': return 'Upload Failed';
      default: return isDragging ? 'Drop your image here' : placeholder;
    }
  };

  const formatAcceptedTypes = (): string => {
    return acceptedFormats
      .map(format => format.split('/')[1].toUpperCase())
      .join(' or ');
  };

  const formatMaxSize = (): string => {
    const sizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    return `${sizeMB}MB`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Main Upload Area */}
      <div className="relative">
        {value ? (
          /* Preview State */
          <div className="group relative">
            <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <img
                src={value}
                alt="Uploaded image preview"
                className="h-32 w-32 mx-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-150 shadow-sm"
                    aria-label="Change image"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-150 shadow-sm"
                    aria-label="Remove image"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            
            {/* Success Badge */}
            {uploadStatus === 'success' && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg animate-bounce">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        ) : (
          /* Upload State */
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 hover:border-gray-300 ${getStatusColor()}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            role="button"
            tabIndex={0}
            aria-label="Upload image"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerFileInput();
              }
            }}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                {getStatusIcon()}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {getStatusText()}
                </h3>
                
                {!uploadStatus && (
                  <p className="text-sm text-gray-600">
                    Drag and drop your image here, or{' '}
                    <span className="text-blue-600 font-medium">browse files</span>
                  </p>
                )}
                
                {uploadStatus === 'uploading' && (
                  <p className="text-sm text-blue-600">
                    Validating and processing your image...
                  </p>
                )}
              </div>
            </div>
            
            {/* Progress Bar for Upload */}
            {uploadStatus === 'uploading' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
                <div className="h-full bg-blue-500 animate-pulse"></div>
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          className="hidden"
          onChange={handleFileUpload}
          aria-label="File input for image upload"
        />
      </div>

      {/* Requirements & Error */}
      <div className="space-y-2">
        {error ? (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <Image className="h-3 w-3" />
              <span>Square format recommended (1:1 aspect ratio)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 flex items-center justify-center">•</span>
              <span>Minimum {minDimensions.width}×{minDimensions.height}px, Maximum {formatMaxSize()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 flex items-center justify-center">•</span>
              <span>{formatAcceptedTypes()} format preferred</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UMSLogoUpload;
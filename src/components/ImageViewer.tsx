import { Download, Eye, Maximize2, X } from "lucide-react";
import { useState } from "react";

interface ImageViewerProps {
  src: string;
  alt?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showActions?: boolean;
  className?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt = "Image",
  title,
  size = 'md',
  showActions = true,
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      )}
      
      <div className="relative group">
        {/* Main Image */}
        <div className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200`}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-transparent"></div>
            </div>
          )}

          {/* Action Overlay */}
          {showActions && imageLoaded && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 shadow-sm"
                  title="View full size"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={downloadImage}
                  className="bg-white text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 shadow-sm"
                  title="Download image"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 shadow-sm"
                  title="Expand"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Size Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 -right-4 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-150 shadow-lg z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
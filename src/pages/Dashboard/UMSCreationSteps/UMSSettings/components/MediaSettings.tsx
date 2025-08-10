import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { Card } from "./common";
import MediaUploadModal from '../../../../../components/MediaUploadModal';

interface MediaSettingsProps {
  logoUrl?: string;
  photoUrl?: string;
  onLogoChange: (file: File) => void;
  onPhotoChange: (file: File) => void;
  isUploadingLogo?: boolean;
  isUploadingPhoto?: boolean;
  // New props for displaying the selected file before upload
  logoPreviewUrl?: string;
  photoPreviewUrl?: string;
}

const MediaSettings: React.FC<MediaSettingsProps> = ({
  logoUrl,
  photoUrl,
  onLogoChange,
  onPhotoChange,
  isUploadingLogo = false,
  isUploadingPhoto = false,
  logoPreviewUrl,
  photoPreviewUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<'logo' | 'photo' | null>(null);

  const handleOpenModal = (type: 'logo' | 'photo') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const handleFileSelect = (file: File) => {
    if (modalType === 'logo') {
      onLogoChange(file);
    } else if (modalType === 'photo') {
      onPhotoChange(file);
    }
    handleModalClose();
  };

  // Helper function to determine which image to show
  const getDisplayImage = (previewUrl?: string, savedUrl?: string) => {
    // If we have a preview URL (user just selected a file), show that
    if (previewUrl) return previewUrl;
    // Otherwise, show the saved URL if it exists
    return savedUrl;
  };

  const logoDisplayUrl = getDisplayImage(logoPreviewUrl, logoUrl);
  const photoDisplayUrl = getDisplayImage(photoPreviewUrl, photoUrl);

  return (
    <>
      <Card title="Media">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className="flex items-center space-x-4">
              {logoDisplayUrl && (
                <img src={logoDisplayUrl} alt="Logo" className="h-12 w-12 rounded-lg object-cover" />
              )}
              <button
                type="button"
                className={`flex items-center space-x-2 px-4 py-2 border rounded-md cursor-pointer transition-colors duration-200
                  ${isUploadingLogo ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 border-gray-300'}`}
                onClick={() => handleOpenModal('logo')}
                disabled={isUploadingLogo}
              >
                {isUploadingLogo ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
              </button>
            </div>
          </div>

          {/* Photo Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campus Photo</label>
            <div className="flex items-center space-x-4">
              {photoDisplayUrl && (
                <img src={photoDisplayUrl} alt="Campus Photo" className="h-12 w-20 rounded-lg object-cover" />
              )}
              <button
                type="button"
                className={`flex items-center space-x-2 px-4 py-2 border rounded-md cursor-pointer transition-colors duration-200
                  ${isUploadingPhoto ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 border-gray-300'}`}
                onClick={() => handleOpenModal('photo')}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      <MediaUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onFileSelect={handleFileSelect}
        title={modalType === 'logo' ? 'Upload Logo' : 'Upload Campus Photo'}
      />
    </>
  );
};

export default MediaSettings;
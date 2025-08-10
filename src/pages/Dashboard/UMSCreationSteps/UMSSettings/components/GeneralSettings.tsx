import React from 'react';
import { Card, FormInput, FormSelect, FormTextarea, MediaSettings } from './common';
import { UMSForm } from '../../../../../interfaces/types';

interface GeneralSettingsProps {
  formData: UMSForm;
  onInputChange: <K extends keyof UMSForm>(field: K, value: UMSForm[K]) => void;
  // updateField: <K extends keyof UMSForm>(field: K, value: UMSForm[K]) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  formData,
  onInputChange,
  // updateField
}) => {
  const [uploadStates, setUploadStates] = React.useState({
    isUploadingLogo: false,
    isUploadingPhoto: false
  });

  const [previewUrls, setPreviewUrls] = React.useState({
    logoPreviewUrl: '',
    photoPreviewUrl: ''
  });

  const handleFileUpload = async (field: keyof UMSForm, file: File) => {
    if (!file) return;

    // Set uploading state
    const uploadingField = field === 'umsLogo' ? 'isUploadingLogo' : 'isUploadingPhoto';
    const previewField = field === 'umsLogo' ? 'logoPreviewUrl' : 'photoPreviewUrl';

    setUploadStates(prev => ({ ...prev, [uploadingField]: true }));

    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setPreviewUrls(prev => ({ ...prev, [previewField]: previewUrl }));

    try {
      // Convert file to data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onInputChange(field, result);

        // Clear upload state but keep preview URL until next file selection
        setUploadStates(prev => ({ ...prev, [uploadingField]: false }));
      };

      reader.onerror = () => {
        // Handle error - clear everything
        setPreviewUrls(prev => ({ ...prev, [previewField]: '' }));
        setUploadStates(prev => ({ ...prev, [uploadingField]: false }));
        URL.revokeObjectURL(previewUrl);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      // Handle any errors - clear everything
      setPreviewUrls(prev => ({ ...prev, [previewField]: '' }));
      setUploadStates(prev => ({ ...prev, [uploadingField]: false }));
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Clear preview when new file is being selected
  const handleFileChange = (field: keyof UMSForm, file: File) => {
    // Clear the old preview URL for this field
    const previewField = field === 'umsLogo' ? 'logoPreviewUrl' : 'photoPreviewUrl';
    const oldPreviewUrl = previewUrls[previewField];

    if (oldPreviewUrl) {
      URL.revokeObjectURL(oldPreviewUrl);
      setPreviewUrls(prev => ({ ...prev, [previewField]: '' }));
    }

    handleFileUpload(field, file);
  };

  // Clean up object URLs on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrls.logoPreviewUrl) {
        URL.revokeObjectURL(previewUrls.logoPreviewUrl);
      }
      if (previewUrls.photoPreviewUrl) {
        URL.revokeObjectURL(previewUrls.photoPreviewUrl);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card title="General Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="UMS Name"
            value={formData.umsName}
            onChange={(value) => onInputChange('umsName', value)}
            required
          />

          <FormInput
            label="Tagline"
            value={formData.umsTagline || ""}
            onChange={(value) => onInputChange('umsTagline', value)}
          />

          <FormInput
            label="Website"
            type="url"
            value={formData.umsWebsite || ""}
            onChange={(value) => onInputChange('umsWebsite', value)}
          />

          <FormSelect
            label="Size"
            value={formData.umsSize || ""}
            onChange={(value) => onInputChange('umsSize', value)}
            options={[
              { value: 'Small', label: 'Small (1-500 students)' },
              { value: 'Medium', label: 'Medium (501-2000 students)' },
              { value: 'Large', label: 'Large (2001+ students)' }
            ]}
            placeholder="Select size"
          />
        </div>

        <FormTextarea
          label="Description"
          value={formData.umsDescription}
          onChange={(value) => onInputChange('umsDescription', value)}
          rows={4}
          className="mt-6"
        />
      </Card>

      <MediaSettings
        logoUrl={formData.umsLogo}
        photoUrl={formData.umsPhoto}
        onLogoChange={(file) => handleFileChange("umsLogo", file)}
        onPhotoChange={(file) => handleFileChange("umsPhoto", file)}
        isUploadingLogo={uploadStates.isUploadingLogo}
        isUploadingPhoto={uploadStates.isUploadingPhoto}
        logoPreviewUrl={previewUrls.logoPreviewUrl}
        photoPreviewUrl={previewUrls.photoPreviewUrl}
      />
    </div>
  );
};

export default GeneralSettings;
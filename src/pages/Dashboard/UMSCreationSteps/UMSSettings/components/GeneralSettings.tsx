import React from 'react';
import { Card, FormInput, FormSelect, FormTextarea, MediaSettings } from './common';
import { UMSForm } from '../../../../../interfaces/types';

interface GeneralSettingsProps {
  formData: UMSForm;
  onInputChange: (field: string, value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  formData,
  onInputChange
}) => (
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
      onLogoChange={(file) => console.log('Logo upload:', file)}
      onPhotoChange={(file) => console.log('Photo upload:', file)}
    />
  </div>
);

export default GeneralSettings;
import { Camera, Upload } from "lucide-react";
import { Card } from "./common";

interface MediaSettingsProps {
  logoUrl?: string;
  photoUrl?: string;
  onLogoChange: (file: File) => void;
  onPhotoChange: (file: File) => void;
}

const MediaSettings: React.FC<MediaSettingsProps> = ({
  logoUrl,
  photoUrl,
  onLogoChange,
  onPhotoChange
}) => (
  <Card title="Media">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
        <div className="flex items-center space-x-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}
          <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>Upload Logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onLogoChange(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Campus Photo</label>
        <div className="flex items-center space-x-4">
          {photoUrl && (
            <img
              src={photoUrl}
              alt="Campus"
              className="h-12 w-20 rounded-lg object-cover"
            />
          )}
          <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <Camera className="h-4 w-4" />
            <span>Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onPhotoChange(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  </Card>
);

export default MediaSettings;
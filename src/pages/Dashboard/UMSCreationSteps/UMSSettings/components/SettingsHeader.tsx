import React from 'react';
import { Settings, Save, AlertTriangle } from 'lucide-react';

interface SettingsHeaderProps {
  umsName: string;
  unsavedChanges: boolean;
  onSave: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  umsName,
  unsavedChanges,
  onSave
}) => (
  <header className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <span className="text-gray-500">•</span>
          <span className="text-lg text-gray-600">{umsName}</span>
        </div>

        {unsavedChanges && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Unsaved changes</span>
            </div>
            <button
              onClick={onSave}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  </header>
);

export default SettingsHeader;
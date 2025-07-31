import { UMSForm } from "../../../../../interfaces/types";
import { UMSData } from "../../../../../types/ums-settings.types";
import { Card, PlatformAccessSettings } from "./common";

interface ModulesSettingsProps {
  formData: UMSForm;
  onInputChange: (field: string, value: any) => void;
}

const ModulesSettings: React.FC<ModulesSettingsProps> = ({
  formData,
  onInputChange
}) => {
  const availableModules = [
    'Student Management',
    'Teacher Management',
    'Course Management',
    'Attendance Tracking',
    'Grade Management',
    'Library Management',
    'Fee Management',
    'Timetable Management'
  ];

  return (
    <div className="space-y-6">
      <Card title="Available Modules">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableModules.map((module) => (
            <div key={module} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                checked={formData.modules.includes(module)}
                onChange={(e) => {
                  const newModules = e.target.checked
                    ? [...formData.modules, module]
                    : formData.modules.filter(m => m !== module);
                  onInputChange('modules', newModules);
                }}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{module}</span>
            </div>
          ))}
        </div>
      </Card>

      <PlatformAccessSettings
        platforms={formData.platforms}
        onPlatformChange={(platform, enabled) => 
          onInputChange('platforms', { ...formData.platforms, [platform]: enabled })
        }
      />
    </div>
  );
};

export default ModulesSettings;
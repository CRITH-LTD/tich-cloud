import React from 'react';
import { UMSForm } from "../../../../../interfaces/types";
import { Card, PlatformAccessSettings } from "./common";
import { 
  Users,
  LeafyGreenIcon as Chalkboard,
  Book,
  CalendarCheck,
  GraduationCap,
  Library,
  Wallet,
  Clock,
  CheckCircle,
} from 'lucide-react'; // Import icons from lucide-react

interface ModulesSettingsProps {
  formData: UMSForm;
  onInputChange: <K extends keyof UMSForm>(field: K, value: UMSForm[K]) => void;
}

const ModulesSettings: React.FC<ModulesSettingsProps> = ({
  formData,
  onInputChange
}) => {
  const availableModules = [
    { name: 'Student Management', icon: Users },
    { name: 'Teacher Management', icon: Chalkboard },
    { name: 'Course Management', icon: Book },
    { name: 'Attendance Tracking', icon: CalendarCheck },
    { name: 'Grade Management', icon: GraduationCap },
    { name: 'Library Management', icon: Library },
    { name: 'Fee Management', icon: Wallet },
    { name: 'Timetable Management', icon: Clock },
  ];

  const handleModuleToggle = (moduleName: string) => {
    const isSelected = formData.modules.includes(moduleName);
    const newModules = isSelected
      ? formData.modules.filter(m => m !== moduleName)
      : [...formData.modules, moduleName];
    onInputChange('modules', newModules);
  };

  return (
    <div className="space-y-8">
      <Card title="Available Modules">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {availableModules.map((module) => {
            const isSelected = formData.modules.includes(module.name);
            const IconComponent = module.icon;
            
            return (
              <div
                key={module.name}
                onClick={() => handleModuleToggle(module.name)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  flex items-center space-x-4
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                    : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-sm'
                  }
                `}
              >
                <div className="text-blue-500">
                  <IconComponent size={28} />
                </div>
                <span className="font-semibold text-lg">{module.name}</span>
                {isSelected && (
                  <CheckCircle size={24} className="text-blue-500 absolute top-3 right-3" />
                )}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleModuleToggle(module.name)}
                  className="sr-only"
                />
              </div>
            );
          })}
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
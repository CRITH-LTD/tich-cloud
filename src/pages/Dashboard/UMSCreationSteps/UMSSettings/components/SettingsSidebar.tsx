import React from 'react';
import { Tab } from '../../../../../types/ums-settings.types';

interface SettingsSidebarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => (
  <nav className="w-64 flex-shrink-0">
    <div className="bg-white rounded-lg border border-gray-200 p-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default SettingsSidebar;
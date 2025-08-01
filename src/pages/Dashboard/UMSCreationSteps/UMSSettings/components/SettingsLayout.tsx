import { Tab } from "../../../../../types/ums-settings.types";
import { SettingsHeader, SettingsSidebar } from "./common";

interface SettingsLayoutProps {
  children: React.ReactNode;
  umsName: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isUpdating: boolean;
  savingError: string | null;
  unsavedChanges: boolean;
  onSave: () => void;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  umsName,
  tabs,
  activeTab,
  onTabChange,
  unsavedChanges,
  isUpdating,
  savingError,
  onSave
}) => (
  <div className="min-h-screen bg-gray-50">
    <SettingsHeader
      isUpdating={isUpdating}
      umsName={umsName}
      savingError={savingError}
      unsavedChanges={unsavedChanges}
      onSave={onSave}
    />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        <SettingsSidebar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default SettingsLayout;
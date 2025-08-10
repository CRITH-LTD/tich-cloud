import React from 'react';
import { Settings, Save, AlertTriangle, AlertCircle, CheckCircle, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface SettingsHeaderProps {
  umsName: string;
  isUpdating: boolean;
  savingError: string | null;
  unsavedChanges: boolean;
  onSave: () => void;
  onDismissError?: () => void;
  lastSaved?: Date | null;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  umsName,
  unsavedChanges,
  isUpdating,
  savingError,
  onSave,
  onDismissError,
  lastSaved
}) => {
  const [showSaveSuccess, setShowSaveSuccess] = React.useState(false);
  const [previousUpdating, setPreviousUpdating] = React.useState(false);

  // Show success message when save completes
  React.useEffect(() => {
    if (previousUpdating && !isUpdating && !savingError && !unsavedChanges) {
      setShowSaveSuccess(true);
      const timer = setTimeout(() => setShowSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
    setPreviousUpdating(isUpdating);
  }, [isUpdating, savingError, unsavedChanges, previousUpdating]);

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b sticky top-[4rem] w-full border-gray-200 shadow-sm z-10">
      <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left Section - Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500 mt-0.5">{umsName}</p>
            </div>
          </div>

          {/* Right Section - Status & Actions */}
          <div className="flex items-center space-x-4">
            {/* Last Saved Indicator */}
            {lastSaved && !unsavedChanges && !isUpdating && (
              <div className="hidden sm:flex items-center space-x-2 text-gray-500 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </div>
            )}

            {/* Success Message */}
            {showSaveSuccess && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 animate-in fade-in duration-300">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Changes saved!</span>
              </div>
            )}

            {/* Error Message */}
            {savingError && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 max-w-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{savingError}</span>
                {onDismissError && (
                  <button
                    onClick={onDismissError}
                    className="ml-1 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Dismiss error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Unsaved Changes Indicator & Save Button */}
            {unsavedChanges && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Unsaved changes</span>
                  </div>
                </div>
                
                <button
                  onClick={onSave}
                  disabled={isUpdating}
                  className={`
                    inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${isUpdating 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md active:scale-95'
                    }
                  `}
                >
                  {isUpdating ? (
                    <>
                      <LoadingSpinner className="border-gray-400 mr-2" size="sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-optimized error display */}
      {savingError && (
        <div className="sm:hidden border-t border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error saving changes</p>
              <p className="text-sm text-red-600 mt-1">{savingError}</p>
            </div>
            {onDismissError && (
              <button
                onClick={onDismissError}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label="Dismiss error"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default SettingsHeader;
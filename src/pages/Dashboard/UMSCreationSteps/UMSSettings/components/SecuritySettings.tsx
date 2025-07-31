import { Shield } from "lucide-react";
import { Card, ToggleSwitch } from "./common";
import { UMSForm } from "../../../../../interfaces/types";

interface SecuritySettingsProps {
    formData: UMSForm;
    onInputChange: (field: string, value: any) => void;
    // showPassword: boolean;
    // onTogglePassword: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
    formData,
    onInputChange,
    // showPassword,
    // onTogglePassword
}) => (
    <div className="space-y-6">
        <Card title="Security Settings">
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                    </div>
                    <ToggleSwitch
                        enabled={formData.enable2FA}
                        onChange={(enabled) => onInputChange('enable2FA', enabled)}
                        color="blue"
                    />
                </div>

                {/* <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-3">
                        <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium text-amber-900">Default Password</p>
                            <p className="text-sm text-amber-700 mb-3">
                                This is the default password for new user accounts
                            </p>
                            <div className="flex items-center space-x-2">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.defaultPassword}
                                    onChange={(e) => onInputChange('defaultPassword', e.target.value)}
                                    className="px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    onClick={onTogglePassword}
                                    className="p-2 text-amber-600 hover:text-amber-800"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </Card>
    </div>
);

export default SecuritySettings;
import React from 'react';
import { Card, ToggleSwitch } from './common';
import { UMSData } from '../../../../../types/ums-settings.types';
import { UMSForm } from '../../../../../interfaces/types';

interface PlatformAccessSettingsProps {
    platforms: UMSForm['platforms'];
    onPlatformChange: (platform: keyof UMSData['platforms'], enabled: boolean) => void;
}

const PlatformAccessSettings: React.FC<PlatformAccessSettingsProps> = ({
    platforms,
    onPlatformChange
}) => (
    <Card title="Platform Access">
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-green-600 rounded" />
                    <div>
                        <p className="font-medium text-gray-900">Teacher Mobile App</p>
                        <p className="text-sm text-gray-500">Mobile application for teachers</p>
                    </div>
                </div>
                <ToggleSwitch
                    enabled={platforms.teacherApp}
                    onChange={(enabled) => onPlatformChange('teacherApp', enabled)}
                    color="green"
                />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-blue-600 rounded" />
                    <div>
                        <p className="font-medium text-gray-900">Student Mobile App</p>
                        <p className="text-sm text-gray-500">Mobile application for students</p>
                    </div>
                </div>
                <ToggleSwitch
                    enabled={platforms.studentApp}
                    onChange={(enabled) => onPlatformChange('studentApp', enabled)}
                    color="blue"
                />
            </div>
        </div>
    </Card>
);

export default PlatformAccessSettings;
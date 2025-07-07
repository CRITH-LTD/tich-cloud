import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUMSDetail } from "../../dashboard.hooks";
import { Breadcrumbs } from "../../../../components/Common/Breadcrumbs";
import {
    Settings,
    Save,
    Trash2,
    Eye,
    EyeOff,
    Plus,
    Shield,
    Users,
    Key,
    Camera,
    Upload,
    AlertTriangle,
    Info,
    XCircle,
    Edit,
    Crown,
    Lock,
    Database,
    School2Icon
} from "lucide-react";
import { UMSForm } from "../../../../interfaces/types";

const UMSSettingsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { ums, isLoading, error, fetchUMS } = useUMSDetail();
    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [formData, setFormData] = useState<UMSForm>({});

    useEffect(() => {
        if (id) fetchUMS(id);
    }, [id]);

    useEffect(() => {
        if (ums) {
            setFormData({
                umsName: ums.umsName || '',
                umsTagline: ums.umsTagline || '',
                umsDescription: ums.umsDescription || '',
                umsWebsite: ums.umsWebsite || '',
                umsSize: ums.umsSize || '',
                umsType: ums.umsType || undefined,
                adminName: ums.adminName || '',
                adminEmail: ums.adminEmail || '',
                adminPhone: ums.adminPhone || '',
                enable2FA: ums.enable2FA || false,
                defaultPassword: 'password123', // This would come from API
                modules: ums.modules || [],
                platforms: ums.platforms || {},
                roles: ums.roles || [],
                departments: ums.departments || []
            });
        }
    }, [ums]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setUnsavedChanges(true);
    };

    const handleSave = () => {
        // API call to save changes
        console.log('Saving changes:', formData);
        setUnsavedChanges(false);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'admin', label: 'Admin', icon: Crown },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'roles', label: 'Roles & Permissions', icon: Key },
        { id: 'departments', label: 'Departments', icon: School2Icon },
        { id: 'modules', label: 'Modules & Platforms', icon: Database },
        { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Loading UMS settings...</p>
                </div>
            </div>
        );
    }

    if (error || !ums) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Settings</h2>
                    <p className="text-gray-600">{error || 'UMS not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Breadcrumbs />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center space-x-3">
                                <Settings className="h-6 w-6 text-gray-600" />
                                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                                <span className="text-gray-500">•</span>
                                <span className="text-lg text-gray-600">{ums.umsName}</span>
                            </div>

                            {unsavedChanges && (
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2 text-amber-600">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span className="text-sm">Unsaved changes</span>
                                    </div>
                                    <button
                                        onClick={handleSave}
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-8">
                        {/* Sidebar Navigation */}
                        <nav className="w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg border border-gray-200 p-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${activeTab === tab.id
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

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* General Settings */}
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    UMS Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.umsName}
                                                    onChange={(e) => handleInputChange('umsName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tagline
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.umsTagline}
                                                    onChange={(e) => handleInputChange('umsTagline', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    value={formData.umsWebsite}
                                                    onChange={(e) => handleInputChange('umsWebsite', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Size
                                                </label>
                                                <select
                                                    value={formData.umsSize}
                                                    onChange={(e) => handleInputChange('umsSize', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select size</option>
                                                    <option value="Small">Small (1-500 students)</option>
                                                    <option value="Medium">Medium (501-2000 students)</option>
                                                    <option value="Large">Large (2001+ students)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.umsDescription}
                                                onChange={(e) => handleInputChange('umsDescription', e.target.value)}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Logo
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    {ums.umsLogoUrl && (
                                                        <img
                                                            src={`http://localhost:8000${ums.umsLogoUrl}`}
                                                            alt="Logo"
                                                            className="h-12 w-12 rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                                        <Upload className="h-4 w-4" />
                                                        <span>Upload Logo</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Campus Photo
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    {ums.umsPhotoUrl && (
                                                        <img
                                                            src={`http://localhost:8000${ums.umsPhotoUrl}`}
                                                            alt="Campus"
                                                            className="h-12 w-20 rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                                        <Camera className="h-4 w-4" />
                                                        <span>Upload Photo</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin Settings */}
                            {activeTab === 'admin' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrator Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Admin Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.adminName}
                                                    onChange={(e) => handleInputChange('adminName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.adminEmail}
                                                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.adminPhone}
                                                    onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Settings */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Shield className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleInputChange('enable2FA', !formData.enable2FA)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.enable2FA ? 'bg-blue-600' : 'bg-gray-200'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.enable2FA ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                <div className="flex items-start space-x-3">
                                                    <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-amber-900">Default Password</p>
                                                        <p className="text-sm text-amber-700 mb-3">
                                                            This is the default password for new user accounts
                                                        </p>
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                value={formData.defaultPassword}
                                                                onChange={(e) => handleInputChange('defaultPassword', e.target.value)}
                                                                className="px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                            />
                                                            <button
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="p-2 text-amber-600 hover:text-amber-800"
                                                            >
                                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Roles Settings */}
                            {activeTab === 'roles' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
                                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                <Plus className="h-4 w-4" />
                                                <span>Add Role</span>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {formData.roles.map((role, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center space-x-3">
                                                            <Key className="h-5 w-5 text-blue-600" />
                                                            <span className="font-medium text-gray-900">{role.name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button className="p-1 text-blue-600 hover:text-blue-800">
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button className="p-1 text-red-600 hover:text-red-800">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {role.permissions?.map((permission, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                                {permission.name.replace(/_/g, " ")}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Departments */}
                            {activeTab === 'departments' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Departments</h3>
                                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                <Plus className="h-4 w-4" />
                                                <span>Add Department</span>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {formData.departments.map((dept, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <School2Icon className="h-5 w-5 text-green-600" />
                                                            <div>
                                                                <span className="font-medium text-gray-900">{dept.name}</span>
                                                                {dept.description && (
                                                                    <p className="text-sm text-gray-500">{dept.description}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button className="p-1 text-blue-600 hover:text-blue-800">
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button className="p-1 text-red-600 hover:text-red-800">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modules & Platforms */}
                            {activeTab === 'modules' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Modules</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                'Student Management',
                                                'Teacher Management',
                                                'Course Management',
                                                'Attendance Tracking',
                                                'Grade Management',
                                                'Library Management',
                                                'Fee Management',
                                                'Timetable Management'
                                            ].map((module) => (
                                                <div key={module} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.modules.includes(module)}
                                                        onChange={(e) => {
                                                            const newModules = e.target.checked
                                                                ? [...formData.modules, module]
                                                                : formData.modules.filter(m => m !== module);
                                                            handleInputChange('modules', newModules);
                                                        }}
                                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{module}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Access</h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Users className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Teacher Mobile App</p>
                                                        <p className="text-sm text-gray-500">Mobile application for teachers</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleInputChange('platforms', {
                                                        ...formData.platforms,
                                                        teacherApp: !formData.platforms.teacherApp
                                                    })}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.platforms.teacherApp ? 'bg-green-600' : 'bg-gray-200'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.platforms.teacherApp ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Users className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Student Mobile App</p>
                                                        <p className="text-sm text-gray-500">Mobile application for students</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleInputChange('platforms', {
                                                        ...formData.platforms,
                                                        studentApp: !formData.platforms.studentApp
                                                    })}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.platforms.studentApp ? 'bg-blue-600' : 'bg-gray-200'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.platforms.studentApp ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Danger Zone */}
                            {activeTab === 'danger' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg border border-red-200 p-6">
                                        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center space-x-2">
                                            <AlertTriangle className="h-5 w-5" />
                                            <span>Danger Zone</span>
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-red-900">Delete UMS</p>
                                                        <p className="text-sm text-red-700">
                                                            Permanently delete this UMS and all associated data
                                                        </p>
                                                    </div>
                                                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                                        Delete UMS
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                <div className="flex items-start space-x-3">
                                                    <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-amber-900">Before you proceed</p>
                                                        <ul className="text-sm text-amber-700 mt-2 space-y-1">
                                                            <li>• Make sure you have backed up all important data</li>
                                                            <li>• These actions cannot be undone</li>
                                                            <li>• All users will lose access immediately</li>
                                                            <li>• Consider exporting data before deletion</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UMSSettingsPage;
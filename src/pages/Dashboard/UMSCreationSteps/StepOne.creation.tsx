import { UMSForm } from "../../../interfaces/types";
import { useCreateUMS } from "../dashboard.hooks";
import { Upload, X, AlertCircle } from 'lucide-react';
import { MatriculeConfigurator } from "./MatriculeConfigurator";
import { getFileUrl } from './../../../utils/index';
import { toast } from "react-toastify";
import { useState } from "react";

const StepOne = () => {
    const {
        form,
        updateField,
    } = useCreateUMS();

    const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

    const validateFile = (file: File): string | null => {
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        
        if (file.size > maxSize) {
            return `File size must be less than 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(1)}MB`;
        }
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return 'Please upload a valid image file (JPEG, PNG, or WebP)';
        }
        
        return null;
    };

    const handleFileUpload = (field: keyof UMSForm, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Clear previous error for this field
        setUploadErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
            setUploadErrors(prev => ({
                ...prev,
                [field]: validationError
            }));
            toast.error(validationError, {
                icon: <AlertCircle className="text-red-500 h-5 w-5" />,
            });
            // Clear the input
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            updateField(field, event.target?.result as string);
            toast.success(`${field === 'umsLogo' ? 'Logo' : 'Photo'} uploaded successfully!`);
        };
        reader.onerror = () => {
            const errorMsg = 'Failed to read file. Please try again.';
            setUploadErrors(prev => ({
                ...prev,
                [field]: errorMsg
            }));
            toast.error(errorMsg);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (field: keyof UMSForm) => {
        updateField(field, "");
        setUploadErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
        toast.info(`${field === 'umsLogo' ? 'Logo' : 'Photo'} removed`);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            Basic Information
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Required</span>
                        </h2>
                        
                        {/* UMS Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Institution Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.umsName || ''}
                                onChange={(e) => updateField("umsName", e.target.value)}
                                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 rounded-lg outline-none transition-colors"
                                placeholder="e.g. Gracefield University"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Primary identifier across CRITH Cloud platform.
                            </p>
                        </div>

                        {/* Grid for Type and Population */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            {/* Institution Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.umsType || ''}
                                    onChange={(e) => updateField("umsType", e.target.value as UMSForm["umsType"])}
                                    className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 rounded-lg outline-none transition-colors"
                                >
                                    <option value="">Select type</option>
                                    <option value="university">University</option>
                                    <option value="polytechnic">Polytechnic</option>
                                    <option value="college">College</option>
                                    <option value="institute">Institute</option>
                                    <option value="vocational">Vocational Center</option>
                                </select>
                            </div>

                            {/* Number of Students */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Students <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.umsSize || ''}
                                    onChange={(e) => updateField("umsSize", e.target.value)}
                                    className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 rounded-lg outline-none transition-colors"
                                    placeholder="e.g. 2500"
                                    min={1}
                                    max={100000}
                                />
                            </div>
                        </div>

                        {/* Tagline / Motto */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Motto / Tagline <span className="text-gray-400">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={form.umsTagline || ''}
                                onChange={(e) => updateField("umsTagline", e.target.value)}
                                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 rounded-lg outline-none transition-colors"
                                placeholder="e.g. Knowledge for Service"
                                maxLength={100}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Appears on headers, certificates, and documents.
                            </p>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Additional Details <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                        </h2>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={form.umsDescription || ''}
                                onChange={(e) => updateField("umsDescription", e.target.value)}
                                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 rounded-lg outline-none transition-colors resize-none"
                                placeholder="Brief description of your institution..."
                                rows={3}
                                maxLength={1000}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Internal reference and reporting</span>
                                <span>{(form.umsDescription || '').length}/1000</span>
                            </div>
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                value={form.umsWebsite || ''}
                                onChange={(e) => updateField("umsWebsite", e.target.value)}
                                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 rounded-lg outline-none transition-colors"
                                placeholder="https://www.yourschool.edu"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Used for verification and integrations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Visual Identity */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Visual Identity</h2>
                        
                        {/* Logo Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Institution Logo <span className="text-red-500">*</span>
                            </label>

                            <div className="relative w-full max-w-sm mx-auto group rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-white hover:border-blue-400 transition-colors duration-300">
                                {form.umsLogo ? (
                                    <>
                                        <img
                                            src={getFileUrl(form.umsLogo)}
                                            alt="Institution Logo"
                                            className="object-cover w-full h-48"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage("umsLogo")}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            title="Remove logo"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        <label 
                                            htmlFor="umsLogoUpload"
                                            className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            Click to change logo
                                            <input
                                                id="umsLogoUpload"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) => handleFileUpload("umsLogo", e)}
                                                className="hidden"
                                            />
                                        </label>
                                    </>
                                ) : (
                                    <label
                                        htmlFor="umsLogoUpload"
                                        className="w-full h-48 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <Upload className="h-8 w-8 mb-2" />
                                        <span className="text-sm font-medium">Upload Logo</span>
                                        <span className="text-xs text-gray-400 mt-1">Click to browse</span>
                                        <input
                                            id="umsLogoUpload"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => handleFileUpload("umsLogo", e)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {uploadErrors.umsLogo && (
                                <div className="flex items-center gap-2 text-red-600 text-xs mt-2">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span>{uploadErrors.umsLogo}</span>
                                </div>
                            )}

                            <div className="text-xs text-gray-500 mt-3 bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium mb-1">Requirements:</p>
                                <ul className="list-disc list-inside space-y-0.5 ml-2">
                                    <li>Square format (1:1 ratio)</li>
                                    <li>Min: 256×256px, Max: 5MB</li>
                                    <li>JPEG, PNG, or WebP</li>
                                </ul>
                            </div>
                        </div>

                        {/* Campus Photo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Campus Photo <span className="text-gray-400">(Optional)</span>
                            </label>

                            <div className="relative w-full group rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-white hover:border-blue-400 transition-colors duration-300">
                                {form.umsPhoto ? (
                                    <>
                                        <img
                                            src={getFileUrl(form.umsPhoto)}
                                            alt="Campus Photo"
                                            className="object-cover w-full h-40"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage("umsPhoto")}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            title="Remove photo"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        <label 
                                            htmlFor="umsPhotoUpload"
                                            className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            Click to change photo
                                            <input
                                                id="umsPhotoUpload"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) => handleFileUpload("umsPhoto", e)}
                                                className="hidden"
                                            />
                                        </label>
                                    </>
                                ) : (
                                    <label
                                        htmlFor="umsPhotoUpload"
                                        className="w-full h-40 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <Upload className="h-8 w-8 mb-2" />
                                        <span className="text-sm font-medium">Upload Campus Photo</span>
                                        <span className="text-xs text-gray-400 mt-1">Click to browse</span>
                                        <input
                                            id="umsPhotoUpload"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => handleFileUpload("umsPhoto", e)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {uploadErrors.umsPhoto && (
                                <div className="flex items-center gap-2 text-red-600 text-xs mt-2">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span>{uploadErrors.umsPhoto}</span>
                                </div>
                            )}

                            <div className="text-xs text-gray-500 mt-3 bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium mb-1">Recommended:</p>
                                <ul className="list-disc list-inside space-y-0.5 ml-2">
                                    <li>Landscape format (16:9)</li>
                                    <li>1200×630px or larger</li>
                                    <li>Used on dashboards</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Width Sections */}
            <div className="mt-6 space-y-6">
                {/* Student ID Configuration */}
                {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Student ID System</h2>
                    <MatriculeConfigurator
                        value={form.matriculeConfig || { format: '', placeholders: {}, sequenceLength: 4 }}
                        onChange={(newConfig) => updateField("matriculeConfig", newConfig)}
                    />
                </div> */}
            </div>
        </div>
    );
}

export default StepOne;
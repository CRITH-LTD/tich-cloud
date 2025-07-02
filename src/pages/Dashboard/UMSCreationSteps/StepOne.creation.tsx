import { UMSForm } from "../../../interfaces/types";
import { useCreateUMS } from "../dashboard.hooks";
import { Upload, X } from 'lucide-react';

const StepOne = () => {
    const {
        form,
        updateField,
    } = useCreateUMS();

    const handleFileUpload = (field: keyof UMSForm, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateField(field, event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (field: keyof UMSForm) => {
        updateField(field, "");
    };

    return (
        <div className="space-y-6">
            {/* UMS Logo Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                    UMS Logo <span className="text-red-500">*</span>
                </label>

                <div className="relative w-48 h-48 group rounded-xl border border-dashed border-gray-300 overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                    {form.umsLogo ? (
                        <>
                            <img
                                src={form.umsLogo}
                                alt="Institution Logo"
                                className="object-cover w-full h-full"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage("umsLogo")}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-black/30 text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to change
                            </div>
                        </>
                    ) : (
                        <label
                            htmlFor="umsLogoUpload"
                            className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <Upload className="h-6 w-6 mb-1" />
                            <span className="text-sm">Upload Logo</span>
                            <input
                                id="umsLogoUpload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("umsLogo", e)}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                <p className="text-xs text-gray-500 leading-snug">
                    Upload a square logo <strong>(min 256×256px)</strong> — PNG preferred.
                </p>
            </div>

            {/* UMS Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UMS Name *</label>
                <input
                    type="text"
                    value={form.umsName}
                    onChange={(e) => updateField("umsName", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="e.g. Gracefield University"
                />
                <p className="text-xs text-gray-500 mt-1">This will be used as the public identifier of your institution across TICH Cloud.</p>
            </div>

            {/* Tagline / Motto */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Motto / Tagline</label>
                <input
                    type="text"
                    value={form.umsTagline}
                    onChange={(e) => updateField("umsTagline", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="e.g. Knowledge for Service"
                />
                <p className="text-xs text-gray-500 mt-1">This short phrase may appear on headers and summaries.</p>
            </div>

            {/* Primary Photo Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                    Campus Photo <span className="text-gray-400 font-normal">(Optional)</span>
                </label>

                <div className="relative w-full max-w-md group rounded-xl border border-dashed border-gray-300 overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                    {form.umsPhoto ? (
                        <>
                            <img
                                src={form.umsPhoto}
                                alt="Campus Photo"
                                className="object-cover w-full h-40 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage("umsPhoto")}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-black/30 text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to change photo
                            </div>
                        </>
                    ) : (
                        <label
                            htmlFor="umsPhotoUpload"
                            className="w-full h-40 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <Upload className="h-6 w-6 mb-1" />
                            <span className="text-sm">Upload Campus Photo</span>
                            <input
                                id="umsPhotoUpload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("umsPhoto", e)}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                <p className="text-xs text-gray-500 leading-snug">
                    Recommended size: <strong>1200×630px</strong> (landscape) — used on dashboards & public pages.
                </p>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                    value={form.umsDescription}
                    onChange={(e) => updateField("umsDescription", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="Brief description of your institution or system..."
                    rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">This is for internal reference and admin reporting.</p>
            </div>

            {/* Website */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Website</label>
                <input
                    type="url"
                    value={form.umsWebsite}
                    onChange={(e) => updateField("umsWebsite", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="https://www.yourschool.edu"
                />
                <p className="text-xs text-gray-500 mt-1">Optional. Helps TICH Cloud verify authenticity for integrations.</p>
            </div>

            {/* Institution Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Institution *</label>
                <select
                    value={form.umsType}
                    onChange={(e) => updateField("umsType", e.target.value as UMSForm["umsType"])}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option value="">Select type</option>
                    <option value="university">University</option>
                    <option value="polytechnic">Polytechnic</option>
                    <option value="college">College</option>
                    <option value="institute">Institute</option>
                    <option value="vocational">Vocational Center</option>
                </select>
            </div>

            {/* Number of Students (Estimated) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Student Population *</label>
                <input
                    type="number"
                    value={form.umsSize}
                    onChange={(e) => updateField("umsSize", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="e.g. 2500"
                    min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Used to help scale resources and suggest modules.</p>
            </div>
        </div>
    );
}

export default StepOne;
import { ArrowLeft, Building2, Check, CheckCircle, Copy, Monitor, Package, Plus, Rocket, Smartphone, UserCog, XCircle } from "lucide-react";
import { useCreateUMS } from "../dashboard.hooks";
import { MODULE_TIERS } from "../../../constants/constants";
import { toast } from "react-toastify";
import { useState } from "react";


const StepFive = () => {
    const {
        form,
        back,
        goToTheStep,
        submitUMS
    } = useCreateUMS();

    const platformPricing = {
        teacherApp: 6,
        studentApp: 5,
    };

    const officePricing = 4;

    const totalModuleCost = (modules: string[]) => {
        return modules.reduce((total, moduleWithTier) => {
            // Split the string into module name and tier (e.g., "Student Information_basic")
            const [moduleName, tier] = moduleWithTier.split('_') as [keyof typeof MODULE_TIERS, 'basic' | 'standard' | 'premium'];

            // Get the price from MODULE_TIERS if the module and tier exist
            const modulePrice = MODULE_TIERS[moduleName]?.[tier]?.price || 0;

            return total + modulePrice;
        }, 0);
    };

    const platformCost =
        (form.platforms.teacherApp ? platformPricing.teacherApp : 0) +
        (form.platforms.studentApp ? platformPricing.studentApp : 0);

    const totalOfficeCost =
        (form.platforms.desktopOffices?.length || 0) * officePricing;

    const totalCostPerHour = (
        totalModuleCost(form.modules) +
        platformCost +
        totalOfficeCost
    );
    const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold">Review Your UMS Configuration</h1>
                <p className="opacity-90 mt-1">Confirm your settings before launch</p>
            </div>

            {/* Configuration Summary */}
            <div className="bg-white rounded-2xl  overflow-hidden border border-solid border-gray-300">
                {/* Institution Details */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Institution Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                    <p className="text-sm text-gray-500">UMS Name</p>
                                    <p className="font-medium">{form.umsName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="font-medium">{form.umsDescription || "Not provided"}</p>
                                </div>
                            </div>

                            {/* Logo and Photo Display */}
                            <div className="mt-4 flex flex-wrap gap-4">
                                {form.umsLogo && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Institution Logo</p>
                                        <img
                                            src={form.umsLogo}
                                            alt="Institution logo"
                                            className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    </div>
                                )}
                                {form.umsPhoto && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Campus Photo</p>
                                        <img
                                            src={form.umsPhoto}
                                            alt="Campus photo"
                                            className="h-24 w-32 rounded-lg object-cover border border-gray-200"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Details */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <UserCog className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Administrator</h3>

                            {/* Basic Admin Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{form.adminEmail}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">2FA Status</p>
                                    <p className={`font-medium ${form.enable2FA ? 'text-green-600' : 'text-gray-600'}`}>
                                        {form.enable2FA ? (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="h-4 w-4" /> Enabled
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <XCircle className="h-4 w-4" /> Disabled
                                            </span>
                                        )}
                                    </p>
                                </div>
                                {form.adminPhone && (
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{form.adminPhone}</p>
                                    </div>
                                )}
                            </div>

                            {/* Roles Section */}
                            {form.roles.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-md font-medium text-gray-700 mb-3">Assigned Roles</h4>
                                    <div className="space-y-3">
                                        {form.roles.map((role, roleIndex) => (
                                            <div key={roleIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900">{role.name}</h5>
                                                        {role.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                                        )}
                                                    </div>
                                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                        {role.users.length} {role.users.length === 1 ? 'user' : 'users'}
                                                    </span>
                                                </div>

                                                {/* Role Users with Password */}
                                                {role.users.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <h6 className="text-xs font-medium text-gray-500 mb-2">Users with this role:</h6>
                                                        <ul className="space-y-3">
                                                            {role.users.map((user, userIndex) => (
                                                                <li key={userIndex} className="text-sm">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-gray-800">
                                                                            {user.email}
                                                                            {user.isPrimary && (
                                                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                                                    Primary
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </div>

                                                                    {user.password && (
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <div className="relative flex-1">
                                                                                <input
                                                                                    type="text"
                                                                                    value={user.password}
                                                                                    readOnly
                                                                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm font-mono"
                                                                                />
                                                                                <button
                                                                                    onClick={() => {
                                                                                        navigator.clipboard.writeText(user.password || '')
                                                                                            .then(() => {
                                                                                                setCopiedUserId(`${roleIndex}-${userIndex}`); // Unique ID for each user
                                                                                                setTimeout(() => setCopiedUserId(null), 2000);
                                                                                                toast.success('Password copied to clipboard', {
                                                                                                    icon: <CheckCircle className="text-green-500 h-5 w-5" />,
                                                                                                });
                                                                                            })
                                                                                            .catch((err) => {
                                                                                                toast.error('Failed to copy password', {
                                                                                                    icon: <XCircle className="text-red-500 h-5 w-5" />,
                                                                                                });
                                                                                                console.error('Copy failed:', err);
                                                                                            });
                                                                                    }}
                                                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                                                                                    title="Copy password"
                                                                                >
                                                                                    {copiedUserId === `${roleIndex}-${userIndex}` ? (
                                                                                        <Check className="h-4 w-4 text-green-500" />
                                                                                    ) : (
                                                                                        <Copy className="h-4 w-4" />
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                            <span className="text-xs text-gray-500">Temporary</span>
                                                                        </div>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {form.roles.length === 0 && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                                    <p className="text-gray-500">No roles assigned yet</p>
                                    <button
                                        onClick={() => goToTheStep(2)}
                                        className="mt-2 text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center gap-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Administrator Role
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modules Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <Package className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Selected Modules</h3>
                            {form.modules.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                    {form.modules.map((moduleWithTier) => {
                                        // Split the module and tier (e.g., "Student Information_basic")
                                        const [moduleName, tier] = moduleWithTier.split('_') as [keyof typeof MODULE_TIERS, 'basic' | 'standard' | 'premium'];
                                        const modulePrice = MODULE_TIERS[moduleName]?.[tier]?.price || 0;

                                        return (
                                            <div key={moduleWithTier} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <span className="font-medium">{moduleName}</span>
                                                    <span className="text-xs text-gray-500 ml-2 capitalize">{tier}</span>
                                                </div>
                                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {modulePrice} FCFA/hr
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-2">No modules selected</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Platforms Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                            <Smartphone className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Mobile Platforms</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                {form.platforms.teacherApp && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium">Teacher App</span>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {platformPricing.teacherApp} FCFA/hr
                                        </span>
                                    </div>
                                )}
                                {form.platforms.studentApp && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium">Student App</span>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {platformPricing.studentApp} FCFA/hr
                                        </span>
                                    </div>
                                )}
                                {!form.platforms.teacherApp && !form.platforms.studentApp && (
                                    <p className="text-gray-500">No mobile platforms enabled</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Offices Section */}
                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <Monitor className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Desktop Offices</h3>
                            {form.platforms.desktopOffices.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                    {form.platforms.desktopOffices.map((office) => (
                                        <div key={office} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">{office}</span>
                                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {officePricing} FCFA/hr
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-2">No office roles selected</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Estimated Cost</h3>
                        <p className="text-sm text-gray-500">Hourly rate based on your configuration</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{totalCostPerHour} FCFA/hr</p>
                        <p className="text-sm text-gray-500 mt-1">
                            ≈ {(totalCostPerHour / 600).toFixed(2)} USD/hr
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
                <button
                    onClick={back}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to configuration
                </button>
                <button
                    onClick={() => submitUMS(form)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                    Launch UMS
                    <Rocket className="h-4 w-4" />
                </button>
            </div>
        </div>
    )

}

export default StepFive;
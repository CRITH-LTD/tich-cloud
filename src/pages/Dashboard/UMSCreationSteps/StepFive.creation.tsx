import { ArrowLeft, Building2, Check, CheckCircle, Copy, Monitor, Package, Plus, Rocket, Smartphone, UserCog, XCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useCreateUMS } from "../dashboard.hooks";
import { MODULE_TIERS } from "../../../constants/constants";
import { toast } from "react-toastify";
import { useState } from "react";
import LoadingSpinner from "./UMSSettings/components/LoadingSpinner";
import { generatePreview } from "./MatriculeConfigurator";
import { getFileUrl } from "../../../utils";

const StepFive = () => {
    const {
        form,
        back,
        goToTheStep,
        submitUMS,
        isLaunching,
    } = useCreateUMS();

    const platformPricing = {
        teacherApp: 6,
        studentApp: 5,
    };

    const officePricing = 4;

    const totalModuleCost = (modules: string[]) => {
        return modules.reduce((total, moduleWithTier) => {
            const [moduleName, tier] = moduleWithTier.split('_') as [keyof typeof MODULE_TIERS, 'basic' | 'standard' | 'premium'];
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
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
    const [allPasswordsCopied, setAllPasswordsCopied] = useState(false);

    const togglePasswordVisibility = (userId: string) => {
        const newVisible = new Set(visiblePasswords);
        if (newVisible.has(userId)) {
            newVisible.delete(userId);
        } else {
            newVisible.add(userId);
        }
        setVisiblePasswords(newVisible);
    };

    const copyPassword = (password: string, userId: string) => {
        navigator.clipboard.writeText(password)
            .then(() => {
                setCopiedUserId(userId);
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
    };

    const copyAllPasswords = () => {
        const allPasswords = form.roles.flatMap(role => 
            role.users.filter(user => user.password).map(user => ({
                email: user.email,
                password: user.password,
                role: role.name
            }))
        );

        const passwordText = allPasswords.map(item => 
            `${item.email} (${item.role}): ${item.password}`
        ).join('\n');

        navigator.clipboard.writeText(passwordText)
            .then(() => {
                setAllPasswordsCopied(true);
                setTimeout(() => setAllPasswordsCopied(false), 3000);
                toast.success('All passwords copied to clipboard', {
                    icon: <CheckCircle className="text-green-500 h-5 w-5" />,
                });
            })
            .catch((err) => {
                toast.error('Failed to copy passwords', {
                    icon: <XCircle className="text-red-500 h-5 w-5" />,
                });
                console.error('Copy failed:', err);
            });
    };

    const hasPasswords = form.roles.some(role => role.users.some(user => user.password));

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold">Review Your UMS Configuration</h1>
                <p className="opacity-90 mt-1">Confirm your settings before launch</p>
            </div>

            {/* Password Warning Banner */}
            {hasPasswords && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-amber-800 font-medium">Important: Save Your Passwords</h4>
                            <p className="text-amber-700 text-sm mt-1">
                                The generated passwords below will not be shown again after launch. 
                                Please copy and securely store them before proceeding.
                            </p>
                            <button
                                onClick={copyAllPasswords}
                                className="mt-2 inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 text-sm font-medium"
                            >
                                {allPasswordsCopied ? (
                                    <>
                                        <Check className="h-4 w-4 text-green-600" />
                                        All passwords copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        Copy all passwords
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Configuration Summary */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                {/* Institution Details */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 flex-shrink-0">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Institution Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                    <p className="text-sm text-gray-500">UMS Name</p>
                                    <p className="font-medium text-gray-900">{form.umsName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="font-medium text-gray-900">{form.umsDescription || "Not provided"}</p>
                                </div>
                            </div>

                            {/* Logo and Photo Display */}
                            <div className="mt-4 flex flex-wrap gap-4">
                                {form.umsLogo && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Institution Logo</p>
                                        <img
                                            src={getFileUrl(form.umsLogo)}
                                            alt="Institution logo"
                                            className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    </div>
                                )}
                                {form.umsPhoto && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Campus Photo</p>
                                        <img
                                            src={getFileUrl(form.umsPhoto)}
                                            alt="Campus photo"
                                            className="h-24 w-32 rounded-lg object-cover border border-gray-200"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Matricule Configuration - Consistent styling */}
                            {form.matriculeConfig && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-2">Student Matricule Format</p>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Format Pattern</span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                Preview
                                            </span>
                                        </div>
                                        <div className="font-mono text-sm text-gray-900 bg-white border border-gray-200 rounded px-3 py-2 mb-2">
                                            {form.matriculeConfig.format}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Example: </span>
                                            <span className="font-mono bg-blue-50 text-blue-800 px-2 py-1 rounded">
                                                {generatePreview(form.matriculeConfig)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Admin Details */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600 flex-shrink-0">
                            <UserCog className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Administrator</h3>

                            {/* Basic Admin Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">{form.adminEmail}</p>
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
                                        <p className="font-medium text-gray-900">{form.adminPhone}</p>
                                    </div>
                                )}
                            </div>

                            {/* Roles Section */}
                            {form.roles.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-md font-medium text-gray-700 mb-3">Assigned Roles</h4>
                                    <div className="space-y-4">
                                        {form.roles.map((role, roleIndex) => (
                                            <div key={roleIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex justify-between items-start mb-3">
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

                                                {/* Role Permissions */}
                                                {role.permissions.length > 0 && (
                                                    <div className="mb-4">
                                                        <h6 className="text-xs font-medium text-gray-500 mb-2">Permissions:</h6>
                                                        <div className="flex flex-wrap gap-1">
                                                            {role.permissions.slice(0, 3).map((perm) => (
                                                                <span key={perm.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                    {perm.name.replace('_', ' ').toLowerCase()}
                                                                </span>
                                                            ))}
                                                            {role.permissions.length > 3 && (
                                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                                    +{role.permissions.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Role Users with Enhanced Password Display */}
                                                {role.users.length > 0 && (
                                                    <div className="pt-3 border-t border-gray-200">
                                                        <h6 className="text-xs font-medium text-gray-500 mb-3">Users:</h6>
                                                        <div className="space-y-3">
                                                            {role.users.map((user, userIndex) => {
                                                                const userId = `${roleIndex}-${userIndex}`;
                                                                const isPasswordVisible = visiblePasswords.has(userId);
                                                                
                                                                return (
                                                                    <div key={userIndex} className="bg-white rounded-lg p-3 border border-gray-200">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-sm font-medium text-gray-900">
                                                                                    {user.email}
                                                                                </span>
                                                                                {user.isPrimary && (
                                                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                                                        Primary
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {user.password && (
                                                                            <div className="mt-2">
                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                    <span className="text-xs text-gray-500">Temporary Password:</span>
                                                                                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                                                                        Save before launch
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="relative flex-1">
                                                                                        <input
                                                                                            type={isPasswordVisible ? "text" : "password"}
                                                                                            value={user.password}
                                                                                            readOnly
                                                                                            className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 pr-20 text-sm font-mono"
                                                                                        />
                                                                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                                                                            <button
                                                                                                onClick={() => togglePasswordVisibility(userId)}
                                                                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                                                                                title={isPasswordVisible ? "Hide password" : "Show password"}
                                                                                            >
                                                                                                {isPasswordVisible ? (
                                                                                                    <EyeOff className="h-4 w-4" />
                                                                                                ) : (
                                                                                                    <Eye className="h-4 w-4" />
                                                                                                )}
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => copyPassword(user.password || '', userId)}
                                                                                                className="text-gray-400 hover:text-purple-600 transition-colors"
                                                                                                title="Copy password"
                                                                                            >
                                                                                                {copiedUserId === userId ? (
                                                                                                    <Check className="h-4 w-4 text-green-500" />
                                                                                                ) : (
                                                                                                    <Copy className="h-4 w-4" />
                                                                                                )}
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
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
                                        className="mt-2 text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center gap-1 mx-auto"
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
                        <div className="bg-green-100 p-2 rounded-lg text-green-600 flex-shrink-0">
                            <Package className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Selected Modules</h3>
                            {form.modules.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                    {form.modules.map((moduleWithTier) => {
                                        const [moduleName, tier] = moduleWithTier.split('_') as [keyof typeof MODULE_TIERS, 'basic' | 'standard' | 'premium'];
                                        const modulePrice = MODULE_TIERS[moduleName]?.[tier]?.price || 0;

                                        return (
                                            <div key={moduleWithTier} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div>
                                                    <span className="font-medium text-gray-900">{moduleName}</span>
                                                    <span className="text-xs text-gray-500 ml-2 capitalize bg-gray-200 px-2 py-0.5 rounded-full">{tier}</span>
                                                </div>
                                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                                    {modulePrice} FCFA/hr
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                                    <p className="text-gray-500">No modules selected</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Platforms Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600 flex-shrink-0">
                            <Smartphone className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Mobile Platforms</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                {form.platforms.teacherApp && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <span className="font-medium text-gray-900">Teacher App</span>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                            {platformPricing.teacherApp} FCFA/hr
                                        </span>
                                    </div>
                                )}
                                {form.platforms.studentApp && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <span className="font-medium text-gray-900">Student App</span>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                            {platformPricing.studentApp} FCFA/hr
                                        </span>
                                    </div>
                                )}
                                {!form.platforms.teacherApp && !form.platforms.studentApp && (
                                    <div className="col-span-full p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                                        <p className="text-gray-500">No mobile platforms enabled</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Offices Section */}
                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 flex-shrink-0">
                            <Monitor className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Desktop Offices</h3>
                            {form.platforms.desktopOffices.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                    {form.platforms.desktopOffices.map((office) => (
                                        <div key={office} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="font-medium text-gray-900">{office}</span>
                                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                                {officePricing} FCFA/hr
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                                    <p className="text-gray-500">No office roles selected</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
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
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to configuration
                </button>
                <button
                    onClick={() => submitUMS(form)}
                    disabled={isLaunching}
                    className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 ${isLaunching ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800'}`}
                >
                    {isLaunching ? (
                        <>
                            <LoadingSpinner />
                            Launching...
                        </>
                    ) : (
                        <>
                            Launch UMS
                            <Rocket className="h-4 w-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default StepFive;
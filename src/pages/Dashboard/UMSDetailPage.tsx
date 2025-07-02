import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUMSDetail } from './dashboard.hooks';
import { Breadcrumbs } from '../../components/Common/Breadcrumbs';
import { Check, CheckCircle, Copy, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const UMSDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { ums, isLoading, error, fetchUMS } = useUMSDetail();
    const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchUMS(id);
    }, [id]);

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-2xl mx-auto text-red-600 text-center">
                <p className="text-lg font-semibold">Error</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (!ums) {
        return (
            <div className="p-6 text-center text-gray-500">
                UMS not found.
            </div>
        );
    }

    return (
        <div className="p-8 mx-auto max-w-6xl space-y-10">
            <Breadcrumbs />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{ums.umsName}</h1>
                    <p className="text-sm text-gray-500 mt-1">{ums.umsTagline || 'No tagline provided'}</p>
                </div>
                {ums.umsLogo && (
                    <img
                        src={ums.umsLogo}
                        alt="UMS Logo"
                        className="w-16 h-16 object-cover rounded-full border border-gray-300"
                    />
                )}
            </div>

            {/* General Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    ['Type', ums.umsType],
                    ['Size', ums.umsSize],
                    ['Website', ums.umsWebsite],
                ].map(([label, value], i) => (
                    <div key={i} className="bg-gray-50 border rounded-xl p-5">
                        <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">{label}</h3>
                        <p className="text-base text-gray-800">{value || '—'}</p>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                    {ums.umsDescription || 'No description provided.'}
                </p>
            </div>

            {/* Modules & Platforms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-xl p-6">
                    <h2 className="text-sm font-medium text-gray-500 uppercase mb-3">Modules</h2>
                    {ums.modules?.length ? (
                        <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                            {ums.modules.map((mod, i) => (
                                <li key={i}>{mod}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">—</p>
                    )}
                </div>
                <div className="bg-white border rounded-xl p-6">
                    <h2 className="text-sm font-medium text-gray-500 uppercase mb-3">Platforms</h2>
                    <div className="flex flex-wrap gap-2">
                        {ums.platforms?.teacherApp && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Teacher App</span>
                        )}
                        {ums.platforms?.studentApp && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Student App</span>
                        )}
                        {ums.platforms?.desktopOffices?.map((office, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs">
                                {office}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Admin Details */}
            <div className="bg-white border rounded-xl p-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase mb-4">Root Admin</h2>
                <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Name:</strong> {ums.adminName || '—'}</p>
                    <p><strong>Email:</strong> {ums.adminEmail || '—'}</p>
                    <p><strong>Phone:</strong> {ums.adminPhone || '—'}</p>
                    <p><strong>2FA Enabled:</strong> {ums.enable2FA ? 'Yes' : 'No'}</p>
                </div>
            </div>

            {/* Roles & Users */}
            <div className="bg-white border rounded-xl p-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase mb-4">Roles & Users</h2>
                {ums.roles?.length ? (
                    <div className="space-y-4">
                        {ums.roles.map((role, i) => (
                            <div key={i} className="border rounded p-4 bg-gray-50">
                                <h3 className="font-semibold text-gray-800">{role.name}</h3>
                                {role.description && (
                                    <p className="text-sm text-gray-500 mb-2">{role.description}</p>
                                )}
                                {role.users?.length ? (
                                    <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1">
                                        {role.users.map((user, idx) => (
                                            <>
                                                <li key={idx}>
                                                    {user.email}
                                                    {user.isPrimary && <span className="ml-2 text-xs text-blue-600">(Primary)</span>}
                                                </li>
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
                                                                    setCopiedUserId(`${i}-${idx}`); // Unique ID for each user
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
                                                        {copiedUserId === `${i}-${idx}` ? (
                                                            <Check className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No users assigned.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No roles defined.</p>
                )}
            </div>

            {/* Campus Photo */}
            {
                ums.umsPhoto && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Campus Photo</h3>
                        <img
                            src={ums.umsPhoto}
                            alt="Campus"
                            className="w-full rounded-xl border object-cover max-h-[400px]"
                        />
                    </div>
                )
            }
        </div >
    );
};

export default UMSDetailPage;

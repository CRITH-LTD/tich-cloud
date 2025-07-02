import React, { useEffect, useState } from 'react';
import { useUMSManagement } from './dashboard.hooks';
import { Breadcrumbs } from '../../components/Common/Breadcrumbs';
import { Eye, MoreVertical, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { pathnames } from '../../routes/path-names';

const UMSPage = () => {
    const {
        umsList,
        isLoading,
        error,
        fetchUMSs,
        handleAction,
        setCurrentUMS,
        clearError,
    } = useUMSManagement();

    const navigate = useNavigate();
    const [selectedUMSId, setSelectedUMSId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUMSs();
    }, [fetchUMSs]);

    

    const filteredUMSs = umsList.filter((ums) =>
        ums.umsName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <Breadcrumbs />
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">UMS Instances</h2>
                <button
                    onClick={() => navigate(pathnames.CRATE_UMS)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    <Plus className="h-4 w-4" />
                    Create New UMS
                </button>
            </div>

            {/* Searchbar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by UMS name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-96 border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Loading */}
            {isLoading && filteredUMSs.length === 0 && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-600"></div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="max-w-xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-6" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="ml-1">{error}</span>
                    <button
                        onClick={clearError}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3 text-xl"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* No Results */}
            {!isLoading && filteredUMSs.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No matching UMS instances found.</p>
            )}

            {/* UMS Table */}
            {filteredUMSs.length > 0 && (
                <div className="border rounded-lg shadow-sm">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left">UMS Name</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">Modules</th>
                                <th className="px-6 py-3 text-left">Platforms</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUMSs.map((ums) => (
                                <tr
                                    key={ums.id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <Link to={`/dashboard/ums/${ums.id}`} className="flex items-center gap-2">
                                            {ums.umsLogo && (
                                                <img
                                                    src={ums.umsLogo}
                                                    alt="Logo"
                                                    className="w-8 h-8 object-cover rounded-full border"
                                                />
                                            )}
                                            {ums.umsName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">{ums.umsType || '—'}</td>
                                    <td className="px-6 py-4">{ums.modules?.length || 0}</td>
                                    <td className="px-6 py-4">
                                        {ums.platforms?.teacherApp && (
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs mr-1">
                                                Teacher
                                            </span>
                                        )}
                                        {ums.platforms?.studentApp && (
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                                                Student
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={() =>
                                                setSelectedUMSId((prev) => (prev === ums.id ? null : ums.id))
                                            }
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                        {selectedUMSId === ums.id && (
                                            <div className="absolute right-6 mt-2 w-36 z-10 bg-white border border-gray-200 shadow-lg rounded-md text-sm">
                                                <button
                                                    onClick={() => handleAction('view', ums.id)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                                                >
                                                    <Eye className="inline-block h-4 w-4 mr-2" />
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleAction('delete', ums.id)}
                                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                                >
                                                    Terminate
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UMSPage;

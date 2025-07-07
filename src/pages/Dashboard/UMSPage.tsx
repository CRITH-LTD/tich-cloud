import React, { useEffect, useState } from 'react';
import { useUMSManagement } from './dashboard.hooks';
import { Breadcrumbs } from '../../components/Common/Breadcrumbs';
import {
    Eye,
    MoreVertical,
    Plus,
    Settings,
    Database,
    Users,
    Monitor,
    BookOpen,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { pathnames } from '../../routes/path-names';
import UMSFilterComponent from '../../components/UMSFilterComponent';

const UMSPage = () => {
    const {
        umsList,
        isLoading,
        error,
        fetchUMSs,
        handleAction,
        // setCurrentUMS,
        clearError,
    } = useUMSManagement();

    const navigate = useNavigate();
    const [selectedUMSId, setSelectedUMSId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchUMSs();
    }, [fetchUMSs]);

    const filteredUMSs = umsList.filter((ums) => {
        const matchesSearch = ums.umsName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || ums.umsType === filterType;
        return matchesSearch && matchesFilter;
    });

    const getUMSTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'university':
                return <BookOpen className="h-4 w-4 text-blue-600" />;
            case 'school':
                return <Users className="h-4 w-4 text-green-600" />;
            case 'institute':
                return <Database className="h-4 w-4 text-purple-600" />;
            default:
                return <Monitor className="h-4 w-4 text-gray-600" />;
        }
    };

    const getUMSTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'university':
                return 'bg-blue-100 text-blue-800';
            case 'school':
                return 'bg-green-100 text-green-800';
            case 'institute':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const uniqueTypes = [...new Set(umsList.map(ums => ums.umsType).filter((type): type is Exclude<typeof type, null> => !!type))];

    return (
        <div className="p-6 mx-auto max-w-7xl">
            <Breadcrumbs />

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">UMS Management</h2>
                        <p className="text-gray-600 mt-1">Manage and monitor your University Management System instances</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchUMSs()}
                            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </button>
                        <button
                            onClick={() => navigate(pathnames.CRATE_UMS)}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            <Plus className="h-4 w-4" />
                            Create New UMS
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <Database className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">Total UMS Instances</p>
                                <p className="text-2xl font-bold text-blue-700">{umsList.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-green-900">Active Users</p>
                                <p className="text-2xl font-bold text-green-700">
                                    <i>coming soon</i>
                                    {/* {umsList.reduce((total, ums) => total + (ums.activeUsers || 0), 0)} */}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-purple-900">Total Modules</p>
                                <p className="text-2xl font-bold text-purple-700">
                                    {umsList.reduce((total, ums) => total + (ums.modules?.length || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6">
                    {/* <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search UMS instances..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div> */}
                    <UMSFilterComponent
                        filterType={filterType}
                        setFilterType={setFilterType}
                        uniqueTypes={uniqueTypes}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        totalCount={umsList.length}
                        filteredCount={filteredUMSs.length}
                    />
            </div>

            {/* Loading State */}
            {isLoading && filteredUMSs.length === 0 && (
                <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading UMS instances...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-red-800">Error Loading UMS Instances</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={clearError}
                            className="ml-4 text-red-600 hover:text-red-800 text-lg font-semibold"
                        >
                            ×
                        </button>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => fetchUMSs()}
                            className="inline-flex items-center gap-2 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredUMSs.length === 0 && !error && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No UMS Instances Found</h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm || filterType !== 'all'
                            ? "No instances match your search criteria. Try adjusting your filters."
                            : "Get started by creating your first UMS instance."
                        }
                    </p>
                    {(!searchTerm && filterType === 'all') && (
                        <button
                            onClick={() => navigate(pathnames.CRATE_UMS)}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            <Plus className="h-4 w-4" />
                            Create Your First UMS
                        </button>
                    )}
                </div>
            )}

            {/* UMS Table */}
            {filteredUMSs.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        UMS Instance
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Modules
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Platforms
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUMSs.map((ums) => (
                                    <tr
                                        key={ums.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                to={`/dashboard/ums/${ums.id}`}
                                                className="flex items-center group"
                                            >
                                                {ums.umsLogoUrl ? (
                                                    <img
                                                        src={`http://localhost:8000${ums.umsLogoUrl}?w=40&h=40&fit=crop`}
                                                        alt={`${ums.umsName} logo`}
                                                        className="w-10 h-10 object-cover rounded-full border-2 border-gray-200 mr-4"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                                        <Database className="h-5 w-5 text-gray-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {ums.umsName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {ums.id.substring(0, 8)}...
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ums.umsType ? (
                                                <div className="flex items-center">
                                                    {getUMSTypeIcon(ums.umsType)}
                                                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getUMSTypeColor(ums.umsType)}`}>
                                                        {ums.umsType}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900 font-medium">
                                                    {ums.modules?.length || 0}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">module{ums.modules.length !== 1 ? "s" : ""}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {ums.platforms?.teacherApp && (
                                                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                        <Users className="h-3 w-3 mr-1" />
                                                        Teacher
                                                    </span>
                                                )}
                                                {ums.platforms?.studentApp && (
                                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                        <BookOpen className="h-3 w-3 mr-1" />
                                                        Student
                                                    </span>
                                                )}
                                                {!ums.platforms?.teacherApp && !ums.platforms?.studentApp && (
                                                    <span className="text-gray-400 text-sm">No platforms</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 relative whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() =>
                                                    setSelectedUMSId((prev) => (prev === ums.id ? null : ums.id))
                                                }
                                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                            {selectedUMSId === ums.id && (
                                                <div className="fixed right-10 mt-2 w-48 z-10 bg-white border border-gray-200 shadow-lg rounded-lg py-1">
                                                    <button
                                                        onClick={() => {
                                                            handleAction('view', ums.id);
                                                            setSelectedUMSId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                    >
                                                        <Eye className="h-4 w-4 mr-3" />
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigate(`/dashboard/ums/${ums.id}/settings`);
                                                            setSelectedUMSId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                    >
                                                        <Settings className="h-4 w-4 mr-3" />
                                                        Settings
                                                    </button>
                                                    <hr className="my-1" />
                                                    <button
                                                        onClick={() => {
                                                            handleAction('delete', ums.id);
                                                            setSelectedUMSId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                                    >
                                                        <AlertCircle className="h-4 w-4 mr-3" />
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
                </div>
            )}

            {/* Click outside to close dropdown */}
            {selectedUMSId && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setSelectedUMSId(null)}
                />
            )}
        </div>
    );
};

export default UMSPage;
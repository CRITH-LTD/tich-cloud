import {
    AlertCircle,
    BarChart2,
    ShieldAlert,
    Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { pathnames } from "../../routes/path-names";
import { useEffect, useState } from "react";
import ConsolePage from "../../components/ConsolePage";
import { useUMSManagement } from "./dashboard.hooks";

const DashboardPage = () => {
    const {
        umsList,
        isLoading,
        error,
        fetchUMSs,
        handleAction,
        setCurrentUMS,
        clearError,
    } = useUMSManagement();

    useEffect(() => {
        fetchUMSs();
    }, [fetchUMSs]);

    const [ui, setUI] = useState(true);
    useEffect(() => {
        setUI(false);
    }, []);

    if (ui) {
        return <ConsolePage />;
    }

    return (
        <div className="space-y-8">
            <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Console Home</h1>
                <p className="text-base text-gray-600 mt-1">Welcome to your TICH Education Cloud dashboard. Monitor, manage and evolve your university systems from one place.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">University Management Systems ({umsList.length})</h2>
                            <Link to={pathnames.CRATE_UMS} className="text-sm text-blue-600 font-medium hover:underline">Create New UMS</Link>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                                <p className="flex items-center gap-2 font-medium">
                                    <AlertCircle className="h-4 w-4" /> Failed to load data.
                                </p>
                                <span className="ml-1 text-xs">{error}</span>
                                <button
                                    onClick={clearError}
                                    className="absolute top-0 bottom-0 right-0 px-4 py-3 text-xl"
                                >
                                    &times;
                                </button>
                            </div>
                        )}

                        {!isLoading && umsList.length === 0 && (
                            <p className="text-center text-gray-500 py-8 text-sm">No UMS instances found.</p>
                        )}

                        {umsList.length > 0 && (
                            <div className="overflow-auto rounded-md border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">UMS Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Type</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Modules</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Platforms</th>
                                            <th className="px-4 py-2 text-right font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {umsList.slice(0, 3).map((ums) => (
                                            <tr key={ums.id}>
                                                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{ums.umsName}</td>
                                                <td className="px-4 py-3 text-gray-700">{ums.umsType}</td>
                                                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{ums.modules.join(', ')}</td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {Object.entries(ums.platforms)
                                                        .filter(([, value]) => Array.isArray(value) ? value.length > 0 : value)
                                                        .map(([key]) => key)
                                                        .join(', ')}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button onClick={() => handleAction('view', ums.id)} className="text-blue-600 hover:underline">Edit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-4 text-right">
                            <Link to="/dashboard/ums" className="text-sm font-medium text-blue-600 hover:underline">
                                Go to UMS Management →
                            </Link>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-white border border-gray-200 rounded-lg shadow-md p-5">
                        <h2 className="text-md font-semibold text-gray-800 mb-3">Cost and Usage</h2>
                        <div className="space-y-2 text-sm">
                            <p className="text-red-600 flex items-center gap-1">
                                <BarChart2 className="h-4 w-4" /> Unable to load cost breakdown
                            </p>
                            <p className="text-red-600 flex items-center gap-1">
                                <Zap className="h-4 w-4" /> Forecasted month end costs unavailable
                            </p>
                            <p className="text-red-600 flex items-center gap-1">
                                <ShieldAlert className="h-4 w-4" /> Access denied to savings opportunities
                            </p>
                        </div>
                        <Link
                            to="/dashboard/cost"
                            className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium"
                        >
                            Go to Cost Management →
                        </Link>
                    </section>

                    <section className="bg-white border border-gray-200 rounded-lg shadow-md p-5">
                        <h2 className="text-md font-semibold text-gray-800 mb-3">Security</h2>
                        <div className="border border-red-200 bg-red-50 text-red-600 rounded-md p-3 text-sm">
                            <p className="flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4" /> Access denied to diagnostics.
                            </p>
                            <button className="mt-2 px-3 py-1 border border-red-400 text-red-700 text-xs rounded hover:bg-red-100">
                                Diagnose with TICH Secure
                            </button>
                        </div>
                        <Link
                            to="/dashboard/security"
                            className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium"
                        >
                            Go to Security Center →
                        </Link>
                    </section>
                </div>
            </div>

            {/* Lower Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <section className="bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between">
                    <div>
                        <h2 className="text-md font-semibold text-gray-800 mb-2">Recently Visited</h2>
                        <p className="text-sm text-gray-500">No recently visited services</p>
                    </div>
                    <Link
                        to="/dashboard/history"
                        className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium"
                    >
                        Go to Activity History →
                    </Link>
                </section>

                <section className="bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between">
                    <div>
                        <h2 className="text-md font-semibold text-gray-800 mb-4">Explore TICH</h2>
                        <ul className="list-disc list-inside text-sm text-blue-600 space-y-2">
                            <li><a href="#" className="hover:underline">Build UMS for multi-campus institutions</a></li>
                            <li><a href="#" className="hover:underline">Connect with other edutech innovators</a></li>
                            <li><a href="#" className="hover:underline">Scale exams, finance, and identity systems</a></li>
                        </ul>
                    </div>
                    <Link
                        to="/dashboard/explore"
                        className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium"
                    >
                        Explore All Features →
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;

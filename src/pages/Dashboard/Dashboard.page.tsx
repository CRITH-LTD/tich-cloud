import {
    AlertCircle,
    BarChart2,
    ShieldAlert,
    Zap,
    Plus,
    TrendingUp,
    Shield,
    Settings,
    Users,
    Server,
    Clock,
    ChevronRight,
    Activity,
    Database,
    Globe,
    Eye,
    ArrowUpRight,
    Cpu
} from "lucide-react";
import { Link } from "react-router-dom";
import { pathnames } from "../../routes/path-names";
import { useUMSManagement } from "./dashboard.hooks";

const DashboardPage = () => {
    const {
        umsList,
        isLoading,
        error,
        handleAction,
        clearError,
    } = useUMSManagement();

    // Get the single UMS (first item in the list)
    const currentUMS = umsList?.[0];
    const hasUMS = Boolean(currentUMS);

    // Mock data for demonstration
    const statsData = [
        {
            title: "UMS Status",
            value: hasUMS ? "Active" : "Not Created",
            change: hasUMS ? "+100%" : "0%",
            trend: hasUMS ? "up" : "neutral",
            icon: Database,
            color: hasUMS ? "green" : "gray"
        },
        {
            title: "Total Users",
            value: hasUMS ? "12,483" : "0",
            change: hasUMS ? "+8.2%" : "0%",
            trend: hasUMS ? "up" : "neutral",
            icon: Users,
            color: hasUMS ? "green" : "gray"
        },
        {
            title: "Monthly Cost",
            value: hasUMS ? "2,847 XAF" : "0 XAF",
            change: hasUMS ? "+12.3%" : "0%",
            trend: hasUMS ? "up" : "neutral",
            icon: "img",
            iconSrc: "https://xafx.org/images/XAF_token_logo.png",
            color: hasUMS ? "yellow" : "gray"
        },
        {
            title: "Uptime",
            value: hasUMS ? "99.9%" : "0%",
            change: hasUMS ? "+0.1%" : "0%",
            trend: hasUMS ? "up" : "neutral",
            icon: Activity,
            color: hasUMS ? "emerald" : "gray"
        }
    ];

    const quickActions = [
        ...(hasUMS ? [] : [{
            title: "Create Your UMS",
            description: "Set up your university management system",
            icon: Plus,
            link: pathnames.CRATE_UMS,
            color: "bg-blue-500"
        }]),
        ...(hasUMS ? [{
            title: "Manage UMS",
            description: "Configure your university management system",
            icon: Settings,
            link: `/dashboard/ums/${currentUMS?.id}`,
            color: "bg-blue-500"
        }] : []),
        {
            title: "System Health",
            description: "Monitor all system performance",
            icon: Activity,
            link: "/dashboard/health",
            color: "bg-green-500"
        },
        {
            title: "Security Center",
            description: "Review security alerts and settings",
            icon: Shield,
            link: "/dashboard/security",
            color: "bg-red-500"
        },
        {
            title: "Cost Analysis",
            description: "Analyze spending and optimize costs",
            icon: BarChart2,
            link: "/dashboard/cost",
            color: "bg-purple-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Welcome to TICH Education Cloud Console</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </button>
                        {!hasUMS && (
                            <Link
                                to={pathnames.CRATE_UMS}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create UMS
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 space-y-6">
                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">Failed to load data</p>
                                    <p className="text-sm text-red-600 mt-1">{error}</p>
                                </div>
                            </div>
                            <button
                                onClick={clearError}
                                className="text-red-400 hover:text-red-600 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, index) => {
                        return (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                                            {stat.icon === "img" ? (
                                                <img src={stat.iconSrc} alt="Cost" className="h-6 w-6" />
                                            ) : (
                                                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                                            )}
                                        </div>
                                    </div>
                                    <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-400'}`}>
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        {stat.change}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-600">{stat.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - UMS Management */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Database className="h-5 w-5 text-gray-400 mr-3" />
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Your University Management System
                                        </h2>
                                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${hasUMS ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {hasUMS ? 'Active' : 'Not Created'}
                                        </span>
                                    </div>
                                    {hasUMS && (
                                        <Link
                                            to={`/dashboard/ums/${currentUMS.id}`}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                                        >
                                            Manage
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                {!isLoading && !hasUMS ? (
                                    <div className="text-center py-12">
                                        <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-sm">No UMS created yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Create your university management system to get started</p>
                                        <Link
                                            to={pathnames.CRATE_UMS}
                                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Your UMS
                                        </Link>
                                    </div>
                                ) : hasUMS ? (
                                    <div className="space-y-4">
                                        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <Server className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <h3 className="text-sm font-medium text-gray-900 hover:text-blue-900 cursor-pointer"
                                                                onClick={() => handleAction('view', currentUMS.id)}
                                                            >{currentUMS.umsName}</h3>
                                                            <p className="text-sm text-gray-500">{currentUMS.umsType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex items-center text-xs text-gray-500">
                                                        <span className="flex items-center mr-4">
                                                            <Cpu className="h-3 w-3 mr-1" />
                                                            {currentUMS.modules?.length || 0} module{currentUMS.modules?.length !== 1 ? 's' : ''}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Globe className="h-3 w-3 mr-1" />
                                                            {Object.entries(currentUMS.platforms || {})
                                                                .filter(([, value]) => Array.isArray(value) ? value.length > 0 : value)
                                                                .length} platforms
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleAction('view', currentUMS.id)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>

                                                </div>
                                            </div>
                                        </div>

                                        {/* UMS Details Summary */}
                                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">System Overview</h4>
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <span className="text-gray-500">Created:</span>
                                                    <span className="ml-2 text-gray-900">{new Date(currentUMS.createdAt || Date.now()).toLocaleDateString()}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Status:</span>
                                                    <span className="ml-2 text-green-600 font-medium">Active</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Students:</span>
                                                    <span className="ml-2 text-gray-900">12,483</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Faculty:</span>
                                                    <span className="ml-2 text-gray-900">487</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-gray-500 text-sm mt-4">Loading...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Actions & Monitoring */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-3">
                                    {quickActions.map((action, index) => {
                                        const IconComponent = action.icon;
                                        return (
                                            <Link
                                                key={index}
                                                to={action.link}
                                                className="group flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                                            >
                                                <div className={`p-2 rounded-lg ${action.color} text-white mr-3`}>
                                                    <IconComponent className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                                                    <p className="text-xs text-gray-500">{action.description}</p>
                                                </div>
                                                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className={`flex items-center justify-between p-3 rounded-lg border ${hasUMS ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center">
                                            <BarChart2 className={`h-4 w-4 mr-3 ${hasUMS ? 'text-red-600' : 'text-gray-400'}`} />
                                            <span className={`text-sm font-medium ${hasUMS ? 'text-red-800' : 'text-gray-600'}`}>Cost Monitoring</span>
                                        </div>
                                        <span className={`text-xs ${hasUMS ? 'text-red-600' : 'text-gray-400'}`}>
                                            {hasUMS ? 'Access Denied' : 'Unavailable'}
                                        </span>
                                    </div>

                                    <div className={`flex items-center justify-between p-3 rounded-lg border ${hasUMS ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center">
                                            <ShieldAlert className={`h-4 w-4 mr-3 ${hasUMS ? 'text-red-600' : 'text-gray-400'}`} />
                                            <span className={`text-sm font-medium ${hasUMS ? 'text-red-800' : 'text-gray-600'}`}>Security Diagnostics</span>
                                        </div>
                                        <span className={`text-xs ${hasUMS ? 'text-red-600' : 'text-gray-400'}`}>
                                            {hasUMS ? 'Access Denied' : 'Unavailable'}
                                        </span>
                                    </div>

                                    <div className={`flex items-center justify-between p-3 rounded-lg border ${hasUMS ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center">
                                            <Zap className={`h-4 w-4 mr-3 ${hasUMS ? 'text-red-600' : 'text-gray-400'}`} />
                                            <span className={`text-sm font-medium ${hasUMS ? 'text-red-800' : 'text-gray-600'}`}>Usage Forecasting</span>
                                        </div>
                                        <span className={`text-xs ${hasUMS ? 'text-red-600' : 'text-gray-400'}`}>Unavailable</span>
                                    </div>
                                </div>

                                <button className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 ${hasUMS ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' : 'bg-gray-400 text-white cursor-not-allowed'}`} disabled={!hasUMS}>
                                    {hasUMS ? 'Configure Access' : 'Create UMS First'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                                </div>
                                <Link
                                    to="/dashboard/history"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                                >
                                    View All
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-center py-8">
                                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-sm">
                                    {hasUMS ? 'No recent activity' : 'No activity yet'}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {hasUMS ? 'Your system activity will appear here' : 'Create your UMS to start tracking activity'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Explore Features */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Zap className="h-5 w-5 text-gray-400 mr-3" />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {hasUMS ? 'Enhance Your UMS' : 'Explore TICH'}
                                    </h2>
                                </div>
                                <Link
                                    to="/dashboard/explore"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                                >
                                    View All
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="group border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                            <Server className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {hasUMS ? 'Add More Modules' : 'Multi-Module UMS'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {hasUMS ? 'Expand your system capabilities' : 'Build comprehensive management systems'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                            <Users className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Connect Innovators</p>
                                            <p className="text-xs text-gray-500">Network with edutech experts</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                                            <BarChart2 className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {hasUMS ? 'Optimize Performance' : 'Scale Systems'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {hasUMS ? 'Improve system efficiency' : 'Exams, finance, and identity systems'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
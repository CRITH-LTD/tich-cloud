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
    // DollarSign,
    Cpu} from "lucide-react";
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

    // Mock data for demonstration
    const statsData = [
        {
            title: "Active UMS",
            value: umsList?.length || 0,
            change: "+2.5%",
            trend: "up",
            icon: Database,
            color: "blue"
        },
        {
            title: "Total Users",
            value: "12,483",
            change: "+8.2%",
            trend: "up",
            icon: Users,
            color: "green"
        },
        {
            title: "Monthly Cost",
            value: "2,847 XAF",
            change: "+12.3%",
            trend: "up",
            icon: "img",
            iconSrc: "https://xafx.org/images/XAF_token_logo.png",
            color: "yellow"
        },
        {
            title: "Uptime",
            value: "99.9%",
            change: "+0.1%",
            trend: "up",
            icon: Activity,
            color: "emerald"
        }
    ];

    const quickActions = [
        {
            title: "Create New UMS",
            description: "Set up a new university management system",
            icon: Plus,
            link: pathnames.CRATE_UMS,
            color: "bg-blue-500"
        },
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
                        <Link
                            to={pathnames.CRATE_UMS}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create UMS
                        </Link>
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
                                    <div className="flex items-center text-sm text-green-600">
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
                    {/* })} */}
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
                                            University Management Systems
                                        </h2>
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {umsList?.length || 0}
                                        </span>
                                    </div>
                                    <Link
                                        to="/dashboard/ums"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                                    >
                                        View All
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6">
                                {!isLoading && (!umsList || umsList.length === 0) ? (
                                    <div className="text-center py-12">
                                        <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-sm">No UMS instances found</p>
                                        <Link
                                            to={pathnames.CRATE_UMS}
                                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Your First UMS
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {umsList?.slice(0, 3).map((ums) => (
                                            <div key={ums.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                    <Server className="h-5 w-5 text-blue-600" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <h3 className="text-sm font-medium text-gray-900">{ums.umsName}</h3>
                                                                <p className="text-sm text-gray-500">{ums.umsType}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 flex items-center text-xs text-gray-500">
                                                            <span className="flex items-center mr-4">
                                                                <Cpu className="h-3 w-3 mr-1" />
                                                                {ums.modules?.length || 0} module{ums.modules?.length !== 1 ? 's' : ''}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Globe className="h-3 w-3 mr-1" />
                                                                {Object.entries(ums.platforms || {})
                                                                    .filter(([, value]) => Array.isArray(value) ? value.length > 0 : value)
                                                                    .length} platforms
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleAction('view', ums.id)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        {/* <button
                                                            onClick={() => handleAction('edit', ums.id)}
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center">
                                            <BarChart2 className="h-4 w-4 text-red-600 mr-3" />
                                            <span className="text-sm font-medium text-red-800">Cost Monitoring</span>
                                        </div>
                                        <span className="text-xs text-red-600">Access Denied</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center">
                                            <ShieldAlert className="h-4 w-4 text-red-600 mr-3" />
                                            <span className="text-sm font-medium text-red-800">Security Diagnostics</span>
                                        </div>
                                        <span className="text-xs text-red-600">Access Denied</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center">
                                            <Zap className="h-4 w-4 text-red-600 mr-3" />
                                            <span className="text-sm font-medium text-red-800">Usage Forecasting</span>
                                        </div>
                                        <span className="text-xs text-red-600">Unavailable</span>
                                    </div>
                                </div>
                                
                                <button className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                    Configure Access
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
                                <p className="text-gray-500 text-sm">No recent activity</p>
                                <p className="text-gray-400 text-xs mt-1">Your system activity will appear here</p>
                            </div>
                        </div>
                    </div>

                    {/* Explore Features */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Zap className="h-5 w-5 text-gray-400 mr-3" />
                                    <h2 className="text-lg font-semibold text-gray-900">Explore TICH</h2>
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
                                            <p className="text-sm font-medium text-gray-900">Multi-Campus UMS</p>
                                            <p className="text-xs text-gray-500">Build systems for multiple campuses</p>
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
                                            <p className="text-sm font-medium text-gray-900">Scale Systems</p>
                                            <p className="text-xs text-gray-500">Exams, finance, and identity systems</p>
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
import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import {
    Cloud,
    Menu,
    X,
    Bell,
    User,
    Search,
    Home,
    Building2,
    Users,
    GraduationCap,
    BookOpen,
    CreditCard,
    BarChart3,
    Settings,
    Database,
    Shield,
    Zap,
    Globe,
    //   FileText,
    //   Calendar,
    //   Mail,
    //   Phone,
    ChevronDown,
    Plus,
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingUp,
    Server,
    HardDrive,
    //   Cpu,
    Network
} from 'lucide-react';

const ConsolePage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedService, setSelectedService] = useState('dashboard');

    const services = [
        { id: 'dashboard', name: 'Dashboard', icon: Home, category: 'Overview' },
        { id: 'universities', name: 'Universities', icon: Building2, category: 'Management' },
        { id: 'students', name: 'Student Management', icon: Users, category: 'Management' },
        { id: 'academics', name: 'Academic Services', icon: GraduationCap, category: 'Management' },
        { id: 'courses', name: 'Course Catalog', icon: BookOpen, category: 'Management' },
        { id: 'billing', name: 'Billing & Usage', icon: CreditCard, category: 'Management' },
        { id: 'analytics', name: 'Analytics', icon: BarChart3, category: 'Insights' },
        { id: 'compute', name: 'Compute Services', icon: Server, category: 'Infrastructure' },
        { id: 'storage', name: 'Storage', icon: HardDrive, category: 'Infrastructure' },
        { id: 'database', name: 'Database', icon: Database, category: 'Infrastructure' },
        { id: 'networking', name: 'Networking', icon: Network, category: 'Infrastructure' },
        { id: 'security', name: 'Security Center', icon: Shield, category: 'Security' },
        { id: 'monitoring', name: 'Monitoring', icon: Activity, category: 'Operations' },
        { id: 'settings', name: 'Settings', icon: Settings, category: 'Configuration' }
    ];

    const quickActions = [
        { name: 'Create University', icon: Plus, color: 'bg-green-500', description: 'Launch new institution' },
        { name: 'Add Students', icon: Users, color: 'bg-blue-500', description: 'Bulk import students' },
        { name: 'Deploy Service', icon: Zap, color: 'bg-purple-500', description: 'Launch microservice' },
        { name: 'View Reports', icon: BarChart3, color: 'bg-orange-500', description: 'Analytics dashboard' }
    ];

    const recentActivity = [
        { action: 'University "Tech Institute" created', time: '2 minutes ago', status: 'success' },
        { action: 'Student batch import completed', time: '15 minutes ago', status: 'success' },
        { action: 'Database backup initiated', time: '1 hour ago', status: 'pending' },
        { action: 'Security scan completed', time: '2 hours ago', status: 'warning' }
    ];

    const systemHealth = [
        { service: 'Compute', status: 'healthy', uptime: '99.9%', instances: 24 },
        { service: 'Database', status: 'healthy', uptime: '99.8%', instances: 8 },
        { service: 'Storage', status: 'warning', uptime: '99.5%', instances: 12 },
        { service: 'Networking', status: 'healthy', uptime: '99.9%', instances: 16 }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'warning':
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-blue-500" />;
            default:
                return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
    };

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'text-green-600 bg-green-50';
            case 'warning':
                return 'text-yellow-600 bg-yellow-50';
            case 'error':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-green-600 bg-green-50';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-16'} rounded-3xl bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className={`${!sidebarOpen && 'justify-center'}`}>
                            {sidebarOpen && (
                                <div className='flex items-center space-x-2'>
                                    <Cloud className="h-8 w-8 text-blue-400" />
                                    <span className="text-xl font-bold">TICH</span>
                                    <div className="text-xs text-gray-400">Console</div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {['Overview', 'Management', 'Infrastructure', 'Security', 'Insights', 'Operations', 'Configuration'].map((category) => (
                        <div key={category}>
                            {sidebarOpen && (
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4 first:mt-0">
                                    {category}
                                </div>
                            )}
                            {services
                                .filter(service => service.category === category)
                                .map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => setSelectedService(service.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${selectedService === service.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            } ${!sidebarOpen && 'justify-center'}`}
                                        title={!sidebarOpen ? service.name : ''}
                                    >
                                        <service.icon className="h-5 w-5 flex-shrink-0" />
                                        {sidebarOpen && <span className="text-sm">{service.name}</span>}
                                    </button>
                                ))}
                        </div>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-700">
                    <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1">
                                <div className="text-sm font-medium">John Doe</div>
                                <div className="text-xs text-gray-400">University Admin</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navigation */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">TICH Console</h1>
                            <div className="text-sm text-gray-500">
                                University of Technology - Main Campus
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Region Selector */}
                            <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg">
                                <Globe className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">US East (N. Virginia)</span>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {selectedService === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Status Banner */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                    <div>
                                        <div className="font-medium text-green-800">All Systems Operational</div>
                                        <div className="text-sm text-green-600">Your university infrastructure is running smoothly</div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                                        >
                                            <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                                                <action.icon className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{action.name}</h3>
                                            <p className="text-sm text-gray-600">{action.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Metrics Overview */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Overview</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">12</div>
                                                <div className="text-sm text-gray-600">Active Universities</div>
                                            </div>
                                            <Building2 className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-green-600">
                                            <TrendingUp className="h-4 w-4 mr-1" />
                                            +2 this month
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">24,567</div>
                                                <div className="text-sm text-gray-600">Total Students</div>
                                            </div>
                                            <Users className="h-8 w-8 text-green-500" />
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-green-600">
                                            <TrendingUp className="h-4 w-4 mr-1" />
                                            +1,234 this semester
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">156</div>
                                                <div className="text-sm text-gray-600">Running Services</div>
                                            </div>
                                            <Server className="h-8 w-8 text-purple-500" />
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-green-600">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            All healthy
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">$2,847</div>
                                                <div className="text-sm text-gray-600">Monthly Cost</div>
                                            </div>
                                            <CreditCard className="h-8 w-8 text-orange-500" />
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-red-600">
                                            <TrendingUp className="h-4 w-4 mr-1" />
                                            +12% vs last month
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Activity */}
                                <div className="bg-white rounded-lg border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {recentActivity.map((activity, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    {getStatusIcon(activity.status)}
                                                    <div className="flex-1">
                                                        <div className="text-sm text-gray-900">{activity.action}</div>
                                                        <div className="text-xs text-gray-500">{activity.time}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            View all activity →
                                        </button>
                                    </div>
                                </div>

                                {/* System Health */}
                                <div className="bg-white rounded-lg border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {systemHealth.map((system, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(system.status)}`}>
                                                            {system.status}
                                                        </div>
                                                        <span className="text-sm text-gray-900">{system.service}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-gray-900">{system.uptime}</div>
                                                        <div className="text-xs text-gray-500">{system.instances} instances</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            View detailed metrics →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other Service Views */}
                    {selectedService !== 'dashboard' && (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {services.find(s => s.id === selectedService)?.icon &&
                                        React.createElement(services.find(s => s.id === selectedService)!.icon, {
                                            className: "h-8 w-8 text-blue-600"
                                        })
                                    }
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {services.find(s => s.id === selectedService)?.name}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    This service interface is under development. Full functionality will be available soon.
                                </p>
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ConsolePage;
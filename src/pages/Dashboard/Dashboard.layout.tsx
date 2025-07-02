import { Link, Outlet } from "react-router-dom";
import {
    Bell,
    HelpCircle,
    Settings,
    Globe2,
    UserCircle2,
    Search,
    Grip,
    ChevronDown,
    User,
    LogOut,
} from "lucide-react";
import { Logo } from "../../components/Common/Logo";
import useDashboardLayout from "./dashboard.hooks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAdminEmail } from "../../features/UMS/UMSCreationSlice";

const DashboardLayout = () => {
    const {showMenu, setShowMenu, handleLogout, user, dropdownRef} = useDashboardLayout()
    const dispatch = useDispatch();
    useEffect(() => {
        // Ensure the dropdown is closed on initial render
        dispatch(initializeAdminEmail(user?.email || ""));
    }, [dispatch, user?.email]);
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            {/* Top Bar */}
            <div className="bg-[#0a114e] text-white fixed top-0 left-0 right-0 z-50 border-b border-gray-700">
                <div className="flex items-center justify-between px-4 h-12">
                    {/* Left group: Logo + Menu + Search */}
                    <div className="flex items-center space-x-4">
                        <Logo theme="light" />
                        <Grip />
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-[#0a114e] text-sm text-white pl-8 pr-3 py-1.5 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                                [Alt+S]
                            </span>
                        </div>
                    </div>

                    {/* Right group: Icons + User Info */}
                    <div className="flex items-center space-x-5 text-gray-300 text-sm">
                        <Bell className="h-5 w-5 hover:text-white cursor-pointer" />
                        <HelpCircle className="h-5 w-5 hover:text-white cursor-pointer" />
                        <Settings className="h-5 w-5 hover:text-white cursor-pointer" />
                        <div className="flex items-center space-x-1 hover:text-white cursor-pointer">
                            <Globe2 className="h-4 w-4" />
                            <span>Cameroon (Buea)</span>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center space-x-1 hover:text-white cursor-pointer"
                                onClick={() => setShowMenu(prev => !prev)}
                            >
                                <UserCircle2 className="h-5 w-5" />
                                <span>{user?.firstName || user?.email || "Admimn"}</span>
                                <ChevronDown className="h-4 w-4" />
                            </div>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-sm text-gray-800 rounded-md shadow-lg z-50">
                                    <Link to="/dashboard/profile" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                                        <User className="h-4 w-4" /> My Profile
                                    </Link>
                                    <Link to="/dashboard/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                                        <Settings className="h-4 w-4" /> Settings
                                    </Link>
                                    <Link to="/dashboard/help" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                                        <HelpCircle className="h-4 w-4" /> Help Center
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                    >
                                        <LogOut className="h-4 w-4" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Space for Top Bar */}
            <div className="h-12" />

            <div className="flex">
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

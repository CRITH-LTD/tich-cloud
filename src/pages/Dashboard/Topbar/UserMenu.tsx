import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import ShimmerLoader from '../../../components/Common/ShimmerLoader ';

interface UserData {
    firstName?: string;
    email?: string;
}

interface UserMenuProps {
    user: UserData | null;
    showMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    handleLogout: () => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    loading?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({
    user,
    showMenu,
    setShowMenu,
    handleLogout,
    dropdownRef,
    loading = false
}) => {
    const getUserInitial = () => {
        return (user?.firstName || user?.email || "A").charAt(0).toUpperCase();
    };

    const getUserDisplayName = () => {
        return user?.email ? user.email.split('@')[0] : "";
    };

    const getUserEmail = () => {
        return user?.email || "";
    };

    // Show shimmer if loading or if user data is not available
    if (loading || !user || !user.email) {
        return (
            <div className="flex items-center space-x-2 px-3 py-2">
                <ShimmerLoader width={32} height={32} borderRadius="50%" />
                <div className="text-left">
                    <ShimmerLoader width={80} height={14} className="mb-1" />
                    <ShimmerLoader width={120} height={12} />
                </div>
                <ShimmerLoader width={16} height={16} />
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex items-center space-x-2 hover:text-gray-800 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(prev => !prev)}
            >
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {getUserInitial()}
                </div>
                <div className="text-left">
                    <div className="font-medium text-sm text-gray-700">
                        {getUserDisplayName()}
                    </div>
                    <div className="text-xs text-gray-500">{getUserEmail()}</div>
                </div>
                <ChevronDown className="h-4 w-4" />
            </div>

            {showMenu && (
                <div className="text-academic-900 absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-gray-900">
                            {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-gray-500">{getUserEmail()}</div>
                    </div>
                    <Link 
                        to="/dashboard/profile" 
                        className="flex text-xs items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                        <User className="h-4 w-4 mr-3 text-gray-500" />
                        <span>My Profile</span>
                    </Link>
                    <Link 
                        to="/dashboard/settings" 
                        className="flex text-xs items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                        <Settings className="h-4 w-4 mr-3 text-gray-500" />
                        <span>Settings</span>
                    </Link>
                    <Link 
                        to="/dashboard/help" 
                        className="flex text-xs items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                        <HelpCircle className="h-4 w-4 mr-3 text-gray-500" />
                        <span>Help Center</span>
                    </Link>
                    <div className="border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full text-xs text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center transition-colors"
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
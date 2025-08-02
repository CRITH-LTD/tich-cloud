import React, { useEffect } from 'react';
import { HelpCircle, Settings, Grip } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Database } from 'lucide-react';
import LocationSelector from './LocationSelector';
import UserMenu from './UserMenu';
import useDashboardLayout from '../dashboard.hooks';
import { initializeAdminEmail } from '../../../features/UMS/UMSCreationSlice';
import { Logo } from '../../../components/Common/Logo';
import SearchBox from './Searchbox';

interface Service {
    id: number;
    name: string;
    description: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
}

const TopBar: React.FC = () => {
    const { showMenu, setShowMenu, handleLogout, user, dropdownRef } = useDashboardLayout();
    const dispatch = useDispatch();

    // Services data for search
    const services: Service[] = [
        {
            id: 1,
            name: "Create UMS Instance",
            description: "Set up a new User Management System instance",
            path: "/dashboard/create-ums",
            icon: Database,
            category: "Infrastructure"
        }
    ];

    useEffect(() => {
        dispatch(initializeAdminEmail(user?.email || ""));
    }, [dispatch, user?.email]);

    return (
        <div className="bg-white/95 backdrop-blur-md text-gray-800 fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between px-6 h-16">
                {/* Left group: Logo + Menu + Search */}
                <div className="flex items-center space-x-6">
                    <Logo theme="dark" />
                    <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                        <Grip className="h-5 w-5 text-gray-600" />
                    </div>
                    <SearchBox services={services} />
                </div>

                {/* Right group: Icons + Location + User */}
                <div className="flex items-center space-x-4 text-gray-600">
                    <HelpCircle className="h-5 w-5 hover:text-gray-800 cursor-pointer transition-colors" />
                    <Settings className="h-5 w-5 hover:text-gray-800 cursor-pointer transition-colors" />
                    <LocationSelector />
                    <UserMenu
                        user={user}
                        showMenu={showMenu}
                        setShowMenu={setShowMenu}
                        handleLogout={handleLogout}
                        dropdownRef={dropdownRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
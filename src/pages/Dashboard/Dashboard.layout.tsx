import React from 'react';
import { Outlet } from "react-router-dom";
import TopBar from './Topbar/TopBar';

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-gray-900">
            <TopBar />
            
            {/* Space for Top Bar */}
            <div className="h-16" />

            {/* Main Content */}
            <div className="flex">
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
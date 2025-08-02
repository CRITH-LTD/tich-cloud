import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Command } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    description: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
}

interface SearchBoxProps {
    services: Service[];
}

const SearchBox: React.FC<SearchBoxProps> = ({ services }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(e.target.value);
        setShowSearchResults(e.target.value.length > 0);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setShowSearchResults(false);
    };

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-gray-50 text-sm text-gray-900 pl-10 pr-20 py-2.5 w-80 rounded-lg border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
                    >
                        <X className="h-3 w-3 text-gray-400" />
                    </button>
                )}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Command className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">K</span>
                </div>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    {filteredServices.length > 0 ? (
                        <>
                            <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                                SERVICES
                            </div>
                            {filteredServices.map((service) => (
                                <Link
                                    key={service.id}
                                    to={service.path}
                                    className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer group"
                                    onClick={clearSearch}
                                >
                                    <service.icon className="h-5 w-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 group-hover:text-blue-700">
                                            {service.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {service.description}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                        {service.category}
                                    </div>
                                </Link>
                            ))}
                        </>
                    ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                            <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p>No services found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBox;
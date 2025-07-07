import { useState } from 'react';
import {
    Search,
    Filter,
    Database,
    Users,
    Monitor,
    BookOpen,
    ChevronDown,
    Check,
    X
} from 'lucide-react';

// Enhanced Filter Component
const UMSFilterComponent = ({ 
    filterType, 
    setFilterType, 
    uniqueTypes, 
    searchTerm, 
    setSearchTerm,
    totalCount,
    filteredCount 
}: {
    filterType: string;
    setFilterType: (value: string) => void;
    uniqueTypes: string[];
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    totalCount: number;
    filteredCount: number;
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterSearchTerm, setFilterSearchTerm] = useState('');

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
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'school':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'institute':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const filteredTypes = uniqueTypes.filter(type => 
        type.toLowerCase().includes(filterSearchTerm.toLowerCase())
    );

    const selectedType = filterType === 'all' ? 'All Types' : filterType;
    const hasActiveFilters = filterType !== 'all' || searchTerm;

    const handleFilterSelect = (value: string) => {
        setFilterType(value);
        setIsFilterOpen(false);
        setFilterSearchTerm('');
    };

    const clearAllFilters = () => {
        setFilterType('all');
        setSearchTerm('');
        setIsFilterOpen(false);
        setFilterSearchTerm('');
    };

    return (
        <div className="mb-6">
            {/* Search and Filter Container */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search UMS instances..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="
                            w-full pl-10 pr-4 py-3 
                            border border-gray-300 rounded-xl 
                            shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                            hover:border-gray-400
                            transition-all duration-200
                            bg-white
                            text-gray-700
                            placeholder-gray-500
                        "
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filter and Actions */}
                <div className="flex items-center gap-3">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="
                                group flex items-center gap-3
                                bg-white
                                border border-gray-300 hover:border-gray-400
                                rounded-xl
                                px-4 py-3
                                shadow-sm hover:shadow-md
                                transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500/20
                                min-w-[180px]
                            "
                        >
                            <Filter className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                            <span className="text-gray-700 font-medium text-sm truncate flex-1 text-left">
                                {selectedType}
                            </span>
                            
                            {filterType !== 'all' && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                                    1
                                </span>
                            )}
                            
                            <ChevronDown className={`
                                h-4 w-4 text-gray-500 
                                transition-transform duration-200
                                ${isFilterOpen ? 'rotate-180' : ''}
                            `} />
                        </button>

                        {/* Filter Dropdown Menu */}
                        {isFilterOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsFilterOpen(false)}
                                />
                                
                                <div className="
                                    absolute top-full left-0 right-0 mt-2 z-20
                                    bg-white
                                    border border-gray-200
                                    rounded-xl
                                    shadow-2xl
                                    overflow-hidden
                                    min-w-[280px]
                                    backdrop-blur-sm
                                ">
                                    {/* Filter Header */}
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-700">Filter by Type</h3>
                                            {filterType !== 'all' && (
                                                <button
                                                    onClick={() => handleFilterSelect('all')}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Filter Search */}
                                    <div className="p-3 border-b border-gray-100">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search types..."
                                                value={filterSearchTerm}
                                                onChange={(e) => setFilterSearchTerm(e.target.value)}
                                                className="
                                                    w-full pl-10 pr-3 py-2
                                                    text-sm
                                                    bg-gray-50
                                                    border border-gray-200
                                                    rounded-lg
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300
                                                    placeholder-gray-500
                                                "
                                            />
                                        </div>
                                    </div>

                                    {/* Filter Options */}
                                    <div className="max-h-60 overflow-y-auto">
                                        {/* All Types Option */}
                                        <button
                                            onClick={() => handleFilterSelect('all')}
                                            className={`
                                                w-full flex items-center justify-between
                                                px-4 py-3
                                                text-left text-sm
                                                hover:bg-gray-50
                                                transition-colors duration-150
                                                ${filterType === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                </div>
                                                <span className="font-medium">All Types</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    {totalCount}
                                                </span>
                                                {filterType === 'all' && (
                                                    <Check className="h-4 w-4 text-blue-600" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Type Options */}
                                        {filteredTypes.length > 0 ? (
                                            filteredTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => handleFilterSelect(type)}
                                                    className={`
                                                        w-full flex items-center justify-between
                                                        px-4 py-3
                                                        text-left text-sm
                                                        hover:bg-gray-50
                                                        transition-colors duration-150
                                                        ${filterType === type ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {getUMSTypeIcon(type)}
                                                        <span className="font-medium">{type}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full border ${getUMSTypeColor(type)}`}>
                                                            {type.toLowerCase()}
                                                        </span>
                                                        {filterType === type && (
                                                            <Check className="h-4 w-4 text-blue-600" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                No matching types found
                                            </div>
                                        )}
                                    </div>

                                    {/* Filter Footer */}
                                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600">
                                                {filteredTypes.length} of {uniqueTypes.length} types
                                            </span>
                                            <span className="text-gray-600">
                                                {filteredCount} results
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Clear All Filters Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="
                                flex items-center gap-2
                                px-3 py-2
                                text-sm text-gray-600 hover:text-gray-800
                                bg-gray-100 hover:bg-gray-200
                                rounded-lg
                                transition-colors duration-200
                            "
                        >
                            <X className="h-4 w-4" />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Active filters:</span>
                    <div className="flex items-center gap-2">
                        {searchTerm && (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Search: "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="hover:text-blue-800"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {filterType !== 'all' && (
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                Type: {filterType}
                                <button
                                    onClick={() => setFilterType('all')}
                                    className="hover:text-purple-800"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default UMSFilterComponent;
import { Link, Outlet } from "react-router-dom";
import {
    HelpCircle,
    Settings,
    Search,
    Grip,
    ChevronDown,
    User,
    LogOut,
    Command,
    MapPin,
    Database,
    X,
    Loader2,
} from "lucide-react";
import { Logo } from "../../components/Common/Logo";
import useDashboardLayout from "./dashboard.hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { initializeAdminEmail } from "../../features/UMS/UMSCreationSlice";

type SearchChangeEvent = React.ChangeEvent<HTMLInputElement>

interface LocationData {
    country: string;
    city: string;
    region: string;
    flag: string;
    active: boolean;
    latitude?: number;
    longitude?: number;
}

interface GeolocationPosition {
    coords: {
        latitude: number;
        longitude: number;
    };
}

const DashboardLayout = () => {
    const { showMenu, setShowMenu, handleLogout, user, dropdownRef } = useDashboardLayout()
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showLocationMenu, setShowLocationMenu] = useState(false);
    // const [notifications, setNotifications] = useState(3); // Mock notification count
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Services data for search
    const services = [
        {
            id: 1,
            name: "Create UMS Instance",
            description: "Set up a new User Management System instance",
            path: "/dashboard/create-ums",
            icon: Database,
            category: "Infrastructure"
        }
    ];

    // Fallback locations for the dropdown
    const fallbackLocations: LocationData[] = [
        { country: "Cameroon", city: "Buea", region: "South-West", flag: "🇨🇲", active: false },
        { country: "Nigeria", city: "Lagos", region: "Lagos State", flag: "🇳🇬", active: false },
        { country: "Ghana", city: "Accra", region: "Greater Accra", flag: "🇬🇭", active: false },
    ];

    // Country code to flag emoji mapping
    const countryToFlag = (countryCode: string): string => {
        const flagMap: { [key: string]: string } = {
            'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'FR': '🇫🇷', 'DE': '🇩🇪', 'IT': '🇮🇹', 'ES': '🇪🇸',
            'CM': '🇨🇲', 'NG': '🇳🇬', 'GH': '🇬🇭', 'KE': '🇰🇪', 'ZA': '🇿🇦', 'EG': '🇪🇬', 'MA': '🇲🇦',
            'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳', 'AU': '🇦🇺', 'BR': '🇧🇷', 'MX': '🇲🇽', 'AR': '🇦🇷',
            'RU': '🇷🇺', 'UA': '🇺🇦', 'PL': '🇵🇱', 'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰',
        };
        return flagMap[countryCode.toUpperCase()] || '🌍';
    };

    // Get user's current location
    const getCurrentLocation = async () => {
        setLocationLoading(true);
        setLocationError(null);

        try {
            // Check if geolocation is supported
            if (!navigator.geolocation) {
                throw new Error("Geolocation is not supported by this browser");
            }

            // Get user's coordinates
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000 // 5 minutes
                    }
                );
            });

            const { latitude, longitude } = position.coords;

            // Reverse geocode to get location details
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            if (!response.ok) {
                throw new Error("Failed to get location details");
            }

            const data = await response.json();

            const locationData: LocationData = {
                country: data.countryName || "Unknown",
                city: data.city || data.locality || "Unknown",
                region: data.principalSubdivision || "Unknown",
                flag: countryToFlag(data.countryCode || ""),
                active: true,
                latitude,
                longitude
            };

            setCurrentLocation(locationData);

            // Store in localStorage for persistence
            localStorage.setItem('userLocation', JSON.stringify(locationData));

        } catch (error) {
            console.error("Error getting location:", error);
            setLocationError(error instanceof Error ? error.message : "Failed to get location");

            // Try to load from localStorage as fallback
            const savedLocation = localStorage.getItem('userLocation');
            if (savedLocation) {
                try {
                    const parsedLocation = JSON.parse(savedLocation);
                    setCurrentLocation(parsedLocation);
                } catch (e) {
                    console.error("Error parsing saved location:", e);
                }
            }
        } finally {
            setLocationLoading(false);
        }
    };

    // Load location on component mount
    useEffect(() => {
        // First, try to load from localStorage
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            try {
                const parsedLocation = JSON.parse(savedLocation);
                setCurrentLocation(parsedLocation);
            } catch (e) {
                console.error("Error parsing saved location:", e);
            }
        }

        // Then get fresh location
        getCurrentLocation();
    }, []);

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        dispatch(initializeAdminEmail(user?.email || ""));
    }, [dispatch, user?.email]);

    const handleSearchChange = (e: SearchChangeEvent): void => {
        setSearchQuery(e.target.value);
        setShowSearchResults(e.target.value.length > 0);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setShowSearchResults(false);
    };

    const handleLocationRefresh = () => {
        getCurrentLocation();
    };

    const handleLocationSelect = (location: LocationData) => {
        setCurrentLocation({ ...location, active: true });
        localStorage.setItem('userLocation', JSON.stringify({ ...location, active: true }));
        setShowLocationMenu(false);
    };

    // Display current location or fallback
    const displayLocation = currentLocation || fallbackLocations[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-gray-900">
            {/* Enhanced Top Bar with glassmorphism effect */}
            <div className="bg-white/95 backdrop-blur-md text-gray-800 fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 shadow-sm">
                <div className="flex items-center justify-between px-6 h-16">
                    {/* Left group: Logo + Menu + Enhanced Search */}
                    <div className="flex items-center space-x-6">
                        <Logo theme="dark" />
                        <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                            <Grip className="h-5 w-5 text-gray-600" />
                        </div>

                        {/* Enhanced Search with Command Palette Style */}
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
                    </div>

                    {/* Right group: Enhanced Icons + User Info */}
                    <div className="flex items-center space-x-4 text-gray-600">
                        {/* Notifications TODO*/}
                        {/* <div className="relative">
                            <Bell className="h-5 w-5 hover:text-gray-800 cursor-pointer transition-colors" />
                            {notifications > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                        </div> */}

                        <HelpCircle className="h-5 w-5 hover:text-gray-800 cursor-pointer transition-colors" />
                        <Settings className="h-5 w-5 hover:text-gray-800 cursor-pointer transition-colors" />

                        {/* Enhanced Location Selector with Real Location */}
                        <div className="relative">
                            <div
                                className="flex items-center space-x-2 hover:text-gray-800 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setShowLocationMenu(prev => !prev)}
                            >
                                {locationLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                ) : (
                                    <MapPin className="h-4 w-4 text-green-600" />
                                )}
                                <span className="text-sm font-medium">
                                    {displayLocation.flag} {displayLocation.city}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                            </div>

                            {showLocationMenu && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Current Location</h3>
                                                <p className="text-sm text-gray-500">Your detected location</p>
                                            </div>
                                            <button
                                                onClick={handleLocationRefresh}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                disabled={locationLoading}
                                            >
                                                {locationLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                ) : (
                                                    <MapPin className="h-4 w-4 text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Current Location */}
                                    {currentLocation && (
                                        <div className="px-4 py-3 bg-blue-50 border-b border-gray-100">
                                            <div className="flex items-center">
                                                <span className="text-lg mr-3">{currentLocation.flag}</span>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900 flex items-center">
                                                        {currentLocation.city}, {currentLocation.country}
                                                        <div className="ml-2 h-2 w-2 bg-green-500 rounded-full"></div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">{currentLocation.region}</div>
                                                </div>
                                                <div className="text-xs text-blue-600 font-medium">Current</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Location Error */}
                                    {locationError && (
                                        <div className="px-4 py-3 bg-red-50 border-b border-gray-100">
                                            <div className="text-sm text-red-600">
                                                {locationError}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fallback Locations */}
                                    <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                                        OTHER LOCATIONS
                                    </div>
                                    {fallbackLocations.map((location, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleLocationSelect(location)}
                                        >
                                            <span className="text-lg mr-3">{location.flag}</span>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">
                                                    {location.city}, {location.country}
                                                </div>
                                                <div className="text-sm text-gray-500">{location.region}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Enhanced User Menu */}
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center space-x-2 hover:text-gray-800 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setShowMenu(prev => !prev)}
                            >
                                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                    {(user?.firstName || user?.email || "A").charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left">
                                    {/* <div className="text-sm font-medium">{user?.firstName || "Admin"}</div> */}
                                    <div className="font-medium text-sm text-gray-700">
                                        {user?.email ? user.email.split('@')[0] : "Admin"}
                                    </div>
                                    <div className="text-xs text-gray-500">{user?.email || "admin@example.com"}</div>
                                </div>
                                <ChevronDown className="h-4 w-4" />
                            </div>

                            {showMenu && (
                                <div className="text-academic-900  absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="font-medium text-gray-900">
                                            {user?.email ? user.email.split('@')[0] : "Admin"}
                                        </div>
                                        <div className="text-xs text-gray-500">{user?.email || "admin@example.com"}</div>
                                    </div>
                                    <Link to="/dashboard/profile" className="flex text-xs items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                                        <User className="h-4 w-4 mr-3 text-gray-500" />
                                        <span>My Profile</span>
                                    </Link>
                                    <Link to="/dashboard/settings" className="flex text-xs items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                                        <Settings className="h-4 w-4 mr-3 text-gray-500" />
                                        <span>Settings</span>
                                    </Link>
                                    <Link to="/dashboard/help" className="flex text-xs items-center px-4 py-3 hover:bg-gray-50 transition-colors">
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
                    </div>
                </div>
            </div>

            {/* Space for Enhanced Top Bar */}
            <div className="h-16" />

            {/* Main Content with improved spacing */}
            <div className="flex">
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
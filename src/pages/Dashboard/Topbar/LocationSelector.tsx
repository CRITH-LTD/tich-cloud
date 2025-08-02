import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Loader2 } from 'lucide-react';
import ShimmerLoader from '../../../components/Common/ShimmerLoader ';

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

const LocationSelector: React.FC = () => {
    const [showLocationMenu, setShowLocationMenu] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

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
            if (!navigator.geolocation) {
                throw new Error("Geolocation is not supported by this browser");
            }

            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000
                    }
                );
            });

            const { latitude, longitude } = position.coords;

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
            localStorage.setItem('userLocation', JSON.stringify(locationData));

        } catch (error) {
            console.error("Error getting location:", error);
            setLocationError(error instanceof Error ? error.message : "Failed to get location");

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

    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            try {
                const parsedLocation = JSON.parse(savedLocation);
                setCurrentLocation(parsedLocation);
            } catch (e) {
                console.error("Error parsing saved location:", e);
            }
        }

        getCurrentLocation();
    }, []);

    const handleLocationRefresh = () => {
        getCurrentLocation();
    };

    const handleLocationSelect = (location: LocationData) => {
        setCurrentLocation({ ...location, active: true });
        localStorage.setItem('userLocation', JSON.stringify({ ...location, active: true }));
        setShowLocationMenu(false);
    };

    const displayLocation = currentLocation || fallbackLocations[0];

    return (
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
                {locationLoading ? (
                    <ShimmerLoader width={80} height={16} />
                ) : (
                    <span className="text-sm font-medium">
                        {displayLocation.flag} {displayLocation.city}
                    </span>
                )}
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
                    {currentLocation && !locationLoading && (
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

                    {/* Loading State */}
                    {locationLoading && (
                        <div className="px-4 py-3 bg-blue-50 border-b border-gray-100">
                            <div className="flex items-center">
                                <ShimmerLoader width={24} height={24} borderRadius="50%" className="mr-3" />
                                <div className="flex-1">
                                    <ShimmerLoader width="60%" height={16} className="mb-1" />
                                    <ShimmerLoader width="40%" height={12} />
                                </div>
                                <ShimmerLoader width={40} height={16} />
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
    );
};

export default LocationSelector;
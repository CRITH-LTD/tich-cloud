import React from 'react';
import { Search, Shield, CheckSquare, Square, MinusSquare } from "lucide-react";
import { PermissionsRoles } from '../../../../../../../interfaces/types';

interface PermissionSelectorProps {
    allPermissions: PermissionsRoles[];
    selectedPermissions: PermissionsRoles[] | string[];
    onTogglePermission: (permission: PermissionsRoles) => void;
    onSelectAllPermissions: (permissions: PermissionsRoles[]) => void;
    onDeselectAllPermissions: (permissions: PermissionsRoles[]) => void;
    areAllPermissionsSelected: (permissions: PermissionsRoles[]) => boolean;
    areSomePermissionsSelected: (permissions: PermissionsRoles[]) => boolean;
    permissionSearch: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    categories: string[];
    filteredPermissions: PermissionsRoles[];
    currentCategoryPermissions: PermissionsRoles[];
    error?: string;
    disabled?: boolean;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
    allPermissions,
    selectedPermissions,
    onTogglePermission,
    onSelectAllPermissions,
    onDeselectAllPermissions,
    areAllPermissionsSelected,
    areSomePermissionsSelected,
    permissionSearch,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
    filteredPermissions,
    currentCategoryPermissions,
    error,
    disabled = false
}) => {
    const selectedCount = selectedPermissions.length;
    const totalCount = allPermissions.length;

    // Determine bulk selection state for current view
    const allCurrentSelected = areAllPermissionsSelected(currentCategoryPermissions);
    const someCurrentSelected = areSomePermissionsSelected(currentCategoryPermissions);

    const handleBulkToggle = () => {
        if (allCurrentSelected) {
            onDeselectAllPermissions(currentCategoryPermissions);
        } else {
            onSelectAllPermissions(currentCategoryPermissions);
        }
    };

    const getBulkSelectIcon = () => {
        if (allCurrentSelected) {
            return CheckSquare;
        } else if (someCurrentSelected) {
            return MinusSquare;
        } else {
            return Square;
        }
    };

    const getBulkSelectText = () => {
        if (selectedCategory === "all") {
            return allCurrentSelected ? "Deselect All" : "Select All";
        } else {
            const categoryName = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
            return allCurrentSelected ? `Deselect All ${categoryName}` : `Select All ${categoryName}`;
        }
    };

    const BulkSelectIcon = getBulkSelectIcon();

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">
                    Permissions
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <span className="text-sm text-gray-500">
                    {selectedCount}/{totalCount} selected
                </span>
            </div>

            {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Search and Filter */}
            <div className="mb-4 space-y-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search permissions..."
                        value={permissionSearch}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={disabled}
                    />
                </div>

                {categories.length > 0 && (
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={disabled}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                )}

                {/* Bulk Selection Controls */}
                {currentCategoryPermissions.length > 0 && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
                        <span className="text-sm text-gray-700">
                            {currentCategoryPermissions.length} permission{currentCategoryPermissions.length !== 1 ? 's' : ''}
                            {selectedCategory !== "all" && ` in ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
                        </span>
                        <button
                            onClick={handleBulkToggle}
                            disabled={disabled}
                            className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors ${disabled
                                ? 'text-gray-400 cursor-not-allowed'
                                : someCurrentSelected
                                    ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                                    : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                }`}
                        >
                            <BulkSelectIcon className="w-4 h-4" />
                            {getBulkSelectText()}
                        </button>
                    </div>
                )}
            </div>

            {/* Permissions Grid */}
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
                {filteredPermissions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No permissions found</p>
                        {permissionSearch && (
                            <p className="text-sm mt-1">Try adjusting your search or category filter</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {filteredPermissions.map((perm) => {
                            const permId = typeof perm === 'string' ? perm : perm.id;
                            const selected = selectedPermissions.find(p => p === permId);
                            return (
                                <label
                                    key={perm.id}
                                    className={`flex items-center p-2 rounded border cursor-pointer transition-colors ${selected
                                        ? "bg-blue-50 border-blue-300"
                                        : "bg-white border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={!!selected}
                                        onChange={() => onTogglePermission(perm)}
                                        className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                        disabled={disabled}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900">
                                            {perm.name.replace(/_/g, " ")}
                                        </div>
                                        {perm.description && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {perm.description}
                                            </div>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
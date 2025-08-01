import { useState, useMemo } from 'react';
import { PermissionsRoles } from '../../../../../../../interfaces/types';

export const usePermissionFilter = (allPermissions: PermissionsRoles[]) => {
  const [permissionSearch, setPermissionSearch] = useState("");
  const [selectedPermissionCategory, setSelectedPermissionCategory] = useState<string>("all");

  const getPermissionCategory = (permissionName: string): string => {
    const parts = permissionName.split('_');
    return parts.length > 1 ? parts[0].toLowerCase() : 'general';
  };

  const permissionCategories = useMemo(() => {
    return [...new Set(allPermissions.map(p => getPermissionCategory(p.name)))].sort();
  }, [allPermissions]);

  const filteredPermissions = useMemo(() => {
    return allPermissions.filter(perm => {
      const matchesSearch = perm.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        perm.description?.toLowerCase().includes(permissionSearch.toLowerCase());

      const permCategory = getPermissionCategory(perm.name);
      const matchesCategory = selectedPermissionCategory === "all" ||
        permCategory === selectedPermissionCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allPermissions, permissionSearch, selectedPermissionCategory]);

  // Get permissions for current category (for bulk selection)
  const currentCategoryPermissions = useMemo(() => {
    if (selectedPermissionCategory === "all") {
      return filteredPermissions;
    }
    return allPermissions.filter(perm => 
      getPermissionCategory(perm.name) === selectedPermissionCategory
    );
  }, [allPermissions, selectedPermissionCategory, filteredPermissions]);

  const resetFilters = () => {
    setPermissionSearch("");
    setSelectedPermissionCategory("all");
  };

  return {
    permissionSearch,
    setPermissionSearch,
    selectedPermissionCategory,
    setSelectedPermissionCategory,
    permissionCategories,
    filteredPermissions,
    currentCategoryPermissions,
    getPermissionCategory,
    resetFilters
  };
};
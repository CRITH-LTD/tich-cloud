import { useState, useEffect, useCallback } from 'react';
import { Role, PermissionsRoles } from '../../../../../../../interfaces/types';

interface UseRoleFormProps {
  initialData?: Role;
  existingRoles?: Role[];
  maxRoleNameLength?: number;
  maxDescriptionLength?: number;
  mode: 'add' | 'edit';
  roleIndex?: number;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  permissions?: string;
  general?: string;
}

export const useRoleForm = ({
  initialData,
  existingRoles = [],
  maxRoleNameLength = 50,
  maxDescriptionLength = 200,
  mode,
  roleIndex
}: UseRoleFormProps) => {
  const [form, setForm] = useState<Role>({
    name: "",
    description: "",
    permissions: [],
    users: []
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize form
  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm({
        name: "",
        description: "",
        permissions: [],
        users: []
      });
    }
    setErrors({});
    setHasUnsavedChanges(false);
  }, [initialData]);

  // Track changes
  useEffect(() => {
    if (initialData) {
      const hasChanges = JSON.stringify(form) !== JSON.stringify(initialData);
      setHasUnsavedChanges(hasChanges);
    } else {
      const hasChanges = Boolean(
        form.name ||
        form.description ||
        form.permissions.length > 0 ||
        form.users.length > 0
      );
      setHasUnsavedChanges(hasChanges);
    }
  }, [form, initialData]);

  const validateForm = useCallback((): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Role name is required";
    } else if (form.name.length > maxRoleNameLength) {
      newErrors.name = `Role name must be ${maxRoleNameLength} characters or less`;
    } else if (!/^[a-zA-Z0-9\s_-]+$/.test(form.name)) {
      newErrors.name = "Role name can only contain letters, numbers, spaces, hyphens, and underscores";
    } else {
      const isDuplicate = existingRoles.some((role, index) =>
        role.name.toLowerCase() === form.name.toLowerCase() &&
        (mode === "add" || index !== roleIndex)
      );
      if (isDuplicate) {
        newErrors.name = "A role with this name already exists";
      }
    }

    // Description validation
    if (form.description && form.description.length > maxDescriptionLength) {
      newErrors.description = `Description must be ${maxDescriptionLength} characters or less`;
    }

    // Permissions validation
    if (form.permissions.length === 0) {
      newErrors.permissions = "At least one permission must be selected";
    }

    return newErrors;
  }, [form, existingRoles, mode, roleIndex, maxRoleNameLength, maxDescriptionLength]);

  const togglePermission = (perm: PermissionsRoles) => {
    const exists = form.permissions.some(p => p.id === perm.id);
    const updatedPermissions = exists
      ? form.permissions.filter(p => p.id !== perm.id)
      : [...form.permissions, perm];

    setForm({ ...form, permissions: updatedPermissions });
  };

  const selectAllPermissions = (permissions: PermissionsRoles[]) => {
    // Create a map of existing permissions for quick lookup
    const existingPermissionIds = new Set(form.permissions.map(p => p.id));

    // Add permissions that aren't already selected
    const newPermissions = permissions.filter(perm => !existingPermissionIds.has(perm.id));

    setForm({
      ...form,
      permissions: [...form.permissions, ...newPermissions]
    });
  };

  const deselectAllPermissions = (permissions: PermissionsRoles[]) => {
    const permissionIdsToRemove = new Set(permissions.map(p => p.id));
    const updatedPermissions = form.permissions.filter(p => !permissionIdsToRemove.has(p.id));

    setForm({ ...form, permissions: updatedPermissions });
  };

  const areAllPermissionsSelected = (permissions: PermissionsRoles[]): boolean => {
    const selectedPermissionIds = new Set(form.permissions.map(p => p.id));
    return permissions.every(perm => selectedPermissionIds.has(perm.id));
  };

  const areSomePermissionsSelected = (permissions: PermissionsRoles[]): boolean => {
    const selectedPermissionIds = new Set(form.permissions.map(p => p.id));
    return permissions.some(perm => selectedPermissionIds.has(perm.id));
  };

  const updateForm = (updates: Partial<Role>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const validate = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return {
    form,
    errors,
    hasUnsavedChanges,
    setErrors,
    togglePermission,
    selectAllPermissions,
    deselectAllPermissions,
    areAllPermissionsSelected,
    areSomePermissionsSelected,
    updateForm,
    validate
  };
};
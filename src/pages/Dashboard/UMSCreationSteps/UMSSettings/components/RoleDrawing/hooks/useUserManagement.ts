import { useState, useCallback } from 'react';
import { RoleUser } from '../../../../../../../interfaces/types';

interface UserFormData {
  email: string;
  password: string;
  isPrimary: boolean;
}

export const useUserManagement = (users: RoleUser[], onUsersChange: (users: RoleUser[]) => void) => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserIndex, setEditingUserIndex] = useState<number | null>(null);
  const [userForm, setUserForm] = useState<UserFormData>({
    email: "",
    password: "",
    isPrimary: false
  });
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
  const [userFormErrors, setUserFormErrors] = useState<{ [key: string]: string }>({});

  const validateUserForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!userForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      newErrors.email = "Invalid email format";
    } else {
      const isDuplicate = users.some((user, index) => 
        user.email.toLowerCase() === userForm.email.toLowerCase() && 
        index !== editingUserIndex
      );
      if (isDuplicate) {
        newErrors.email = "A user with this email already exists";
      }
    }

    // Password validation
    if (editingUserIndex === null && !userForm.password.trim()) {
      newErrors.password = "Password is required";
    } else if (userForm.password && userForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Primary user validation
    if (userForm.isPrimary) {
      const existingPrimary = users.find((user, index) => 
        user.isPrimary && index !== editingUserIndex
      );
      if (existingPrimary) {
        newErrors.isPrimary = "Only one primary user is allowed per role";
      }
    }

    setUserFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [userForm, users, editingUserIndex]);

  const handleAddUser = () => {
    setEditingUserIndex(null);
    setUserForm({ email: "", password: "", isPrimary: false });
    setUserFormErrors({});
    setShowUserForm(true);
  };

  const handleEditUser = (index: number) => {
    const user = users[index];
    setEditingUserIndex(index);
    setUserForm({
      email: user.email,
      password: user.password || "",
      isPrimary: user.isPrimary || false
    });
    setUserFormErrors({});
    setShowUserForm(true);
  };

  const handleDeleteUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    onUsersChange(updatedUsers);
  };

  const handleUserSubmit = () => {
    if (!validateUserForm()) return;

    const newUser: RoleUser = {
      email: userForm.email,
      password: userForm.password || undefined,
      isPrimary: userForm.isPrimary || undefined
    };

    let updatedUsers;
    if (editingUserIndex !== null) {
      updatedUsers = [...users];
      updatedUsers[editingUserIndex] = newUser;
    } else {
      updatedUsers = [...users, newUser];
    }

    onUsersChange(updatedUsers);
    setShowUserForm(false);
    setEditingUserIndex(null);
    setUserForm({ email: "", password: "", isPrimary: false });
  };

  const handleCancelUserForm = () => {
    setShowUserForm(false);
    setEditingUserIndex(null);
    setUserForm({ email: "", password: "", isPrimary: false });
    setUserFormErrors({});
  };

  const togglePasswordVisibility = (index: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetForm = () => {
    setShowUserForm(false);
    setEditingUserIndex(null);
    setUserForm({ email: "", password: "", isPrimary: false });
    setShowPasswords({});
    setUserFormErrors({});
  };

  return {
    // State
    showUserForm,
    editingUserIndex,
    userForm,
    showPasswords,
    userFormErrors,
    // Actions
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleUserSubmit,
    handleCancelUserForm,
    togglePasswordVisibility,
    resetForm,
    setUserForm,
    validateUserForm
  };
};
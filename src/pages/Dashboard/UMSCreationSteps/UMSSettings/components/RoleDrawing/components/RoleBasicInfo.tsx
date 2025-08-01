import React from 'react';
import { FormInput } from '../../common';

interface RoleBasicInfoProps {
    name: string;
    description: string;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    nameError?: string;
    descriptionError?: string;
    maxRoleNameLength: number;
    maxDescriptionLength: number;
    disabled?: boolean;
}

export const RoleBasicInfo: React.FC<RoleBasicInfoProps> = ({
    name,
    description,
    onNameChange,
    onDescriptionChange,
    nameError,
    descriptionError,
    maxRoleNameLength,
    maxDescriptionLength,
    disabled = false
}) => {
    return (
        <div className="space-y-6">
            <div>
                <FormInput
                    label="Role Name"
                    value={name}
                    onChange={onNameChange}
                    required
                    error={nameError}
                    maxLength={maxRoleNameLength}
                    placeholder="Enter role name"
                    disabled={disabled}
                />
            </div>

            <div>
                <FormInput
                    label="Description"
                    value={description}
                    onChange={onDescriptionChange}
                    error={descriptionError}
                    maxLength={maxDescriptionLength}
                    placeholder="Enter role description (optional)"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};
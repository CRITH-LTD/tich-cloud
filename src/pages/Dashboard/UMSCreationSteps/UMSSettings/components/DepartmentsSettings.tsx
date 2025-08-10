import React, { useState, useEffect, useRef } from 'react';
import { X, School, AlertCircle, Plus, Edit, Trash2, RefreshCcw } from 'lucide-react';
import { useDepartments } from '../../../../../hooks/useDepartments';
import { toast } from 'react-toastify';
import DepartmentsSkeleton from './DepartmentsSkeleton';
import ConfirmDialog from '../../../../../components/Common/ConfirmDialog';

interface Department {
  _id?: string;
  name: string;
  description?: string;
  ums?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateDepartmentDto {
  name: string;
  description?: string;
}

interface UpdateDepartmentDto {
  name?: string;
  description?: string;
}

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (department: CreateDepartmentDto) => Promise<void>;
  department?: Department | null;
  title?: string;
}

const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  department,
  title = "Add Department"
}) => {
  const [formData, setFormData] = useState<CreateDepartmentDto>({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<CreateDepartmentDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || ''
      });
    } else {
      setFormData({ name: '', description: '' });
    }
    setErrors({});
  }, [department, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateDepartmentDto> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Department name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Department name must not exceed 100 characters';
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined
      };

      await onSubmit(submitData);
      onClose();
      setFormData({ name: '', description: '' });
      setErrors({});
    } catch (error) {
      console.error('Error submitting department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateDepartmentDto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                {department ? 'Update department information' : 'Create a new department for your institution'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
                }`}
              placeholder="e.g., Department of Computer Science"
              disabled={isSubmitting}
            />
            {errors.name && (
              <div className="mt-2 flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={handleChange('description')}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${errors.description
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
                }`}
              placeholder="Provide a brief description of what this department focuses on..."
              disabled={isSubmitting}
            />
            {errors.description && (
              <div className="mt-2 flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.description}</span>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {(formData.description || '').length}/500 characters
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{department ? 'Update Department' : 'Create Department'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DepartmentsSettings: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<{ department: Department; index: number } | null>(null);

  const {
    departments: deptData,
    loading,
    error,
    onAddDepartment,
    onEditDepartment,
    onDeleteDepartment,
    refreshDepartments,
  } = useDepartments();

  console.log('Departments data:', deptData);

  // Always have an array to render with
  const departments: Department[] = Array.isArray(deptData) ? deptData : [];

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);


  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    (async () => {
      try {
        await refreshDepartments();
      } catch (e) {
        // already handled in hook; optional local log
        console.error('Refresh failed:', e);
      }
    })();
  }, [refreshDepartments]);

  useEffect(() => {
    console.debug('loading:', loading);
  }, [loading]);

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    try {
      await onDeleteDepartment(deleteIndex);
      toast.success('Department deleted successfully');
      await refreshDepartments();
    } catch {
      /* handled in hook */
    } finally {
      setDeleteIndex(null);
    }
  };


  const handleOpenAddModal = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (index: number) => {
    const department = departments[index];
    if (!department) return; // guard invalid index
    setEditingDepartment({ department, index });
    setIsModalOpen(true);
  };

  const handleSubmitDepartment = async (departmentDto: CreateDepartmentDto) => {
    if (editingDepartment) {
      await onEditDepartment(editingDepartment.index, departmentDto);
      toast.success('Department updated successfully');
    } else {
      await onAddDepartment(departmentDto);
      toast.success('Department created successfully');
    }
    await refreshDepartments();
  };

  return (
    <>
      {loading && departments.length === 0 ? (
        <DepartmentsSkeleton count={4} />
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Departments</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your institution&apos;s departments and their specializations
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {/* Refresh Button */}
                <button
                  onClick={() => refreshDepartments()}
                  disabled={loading}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>

                {/* Add Department Button */}
                <button
                  onClick={handleOpenAddModal}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Department</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {departments.length > 0 ? (
                departments.map((dept, index) => (
                  <div key={dept._id ?? `dept-${index}`} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all bg-gray-50/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <School className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{dept.name}</h4>
                          {dept.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{dept.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          onClick={() => handleOpenEditModal(index)}
                          disabled={loading}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50"
                          title="Edit department"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteIndex(index);
                            setConfirmOpen(true);
                          }}
                          disabled={loading}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          title="Delete department"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <School className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">No departments yet</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Departments help organize your institution&apos;s academic structure. Create your first department to get started.
                  </p>
                  <button
                    onClick={handleOpenAddModal}
                    disabled={loading}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create First Department</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Department"
        message={`Are you sure you want to delete "${departments[deleteIndex!]?.name}"? This action cannot be undone.`}
      />

      <DepartmentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDepartment(null);
        }}
        onSubmit={handleSubmitDepartment}
        department={editingDepartment?.department ?? null}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
      />
    </>
  );
};


export default DepartmentsSettings;
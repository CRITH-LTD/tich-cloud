// components/Settings/AcademicUnitsSettings.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Building2,
    GraduationCap,
    Award,
    Plus,
    Edit,
    Trash2,
    RefreshCcw,
    Calendar,
    User
} from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../../../../components/Common/ConfirmDialog';
import AcademicUnitsSkeleton from '../../../../../components/Skeletons/AcademicUnitsSkeleton';
import { useFaculties, useSchools, useCertificationPrograms } from '../../../../../hooks/useAcademicUnits';
import { useDepartments } from '../../../../../hooks/useDepartments';
import { Faculty, School, CertificationProgram, CreateFacultyDto, CreateSchoolDto, CreateCertificationProgramDto } from '../../../../../types/academicUnits.types';
import CertificationProgramFormModal from './Modals/CertificationProgramFormModal';
import FacultyFormModal from './Modals/FacultyFormModal';
import SchoolFormModal from './Modals/SchoolFormModal';

type TabType = 'faculties' | 'schools' | 'certifications';

interface EditingItem {
    item: Faculty | School | CertificationProgram;
    index: number;
    type: TabType;
}

const AcademicUnitsSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('faculties');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<{ index: number; type: TabType } | null>(null);

    // Hooks
    const facultiesHook = useFaculties();
    const schoolsHook = useSchools();
    const programsHook = useCertificationPrograms();
    const departmentsHook = useDepartments({mode: 'all'});

    const didInit = useRef(false);

    useEffect(() => {
        // Handle errors
        if (facultiesHook.error) toast.error(facultiesHook.error);
        if (schoolsHook.error) toast.error(schoolsHook.error);
        if (programsHook.error) toast.error(programsHook.error);
        if (departmentsHook.error) toast.error(departmentsHook.error);
    }, [
        facultiesHook.error,
        schoolsHook.error,
        programsHook.error,
        departmentsHook.error,
    ]);

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;

        const initializeData = async () => {
            try {
                await Promise.all([
                    facultiesHook.refreshFaculties(),
                    schoolsHook.refreshSchools(),
                    programsHook.refreshCertificationPrograms(),
                    departmentsHook.refreshDepartments(),
                ]);
            } catch (e) {
                console.error('Initialization failed:', e);
            }
        };

        initializeData();
    }, [
        facultiesHook.refreshFaculties,
        schoolsHook.refreshSchools,
        programsHook.refreshCertificationPrograms,
        departmentsHook.refreshDepartments,
    ]);

    const currentData = {
        faculties: facultiesHook.faculties,
        schools: schoolsHook.schools,
        certifications: programsHook.certificationPrograms,
    };

    const currentLoading = {
        faculties: facultiesHook.loading,
        schools: schoolsHook.loading,
        certifications: programsHook.loading,
    };

    const handleRefresh = async () => {
        try {
            switch (activeTab) {
                case 'faculties':
                    await facultiesHook.refreshFaculties();
                    break;
                case 'schools':
                    await schoolsHook.refreshSchools();
                    break;
                case 'certifications':
                    await programsHook.refreshCertificationPrograms();
                    break;
            }
        } catch (e) {
            console.error('Refresh failed:', e);
        }
    };

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (index: number) => {
        const item = currentData[activeTab][index];
        if (!item) return;

        setEditingItem({ item, index, type: activeTab });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (index: number) => {
        setDeleteItem({ index, type: activeTab });
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteItem) return;

        try {
            switch (deleteItem.type) {
                case 'faculties':
                    await facultiesHook.onDeleteFaculty(deleteItem.index);
                    toast.success('Faculty deleted successfully');
                    break;
                case 'schools':
                    await schoolsHook.onDeleteSchool(deleteItem.index);
                    toast.success('School deleted successfully');
                    break;
                case 'certifications':
                    await programsHook.onDeleteCertificationProgram(deleteItem.index);
                    toast.success('Certification program deleted successfully');
                    break;
            }
        } catch (error) {
            // Error handled in hooks
        } finally {
            setDeleteItem(null);
            setConfirmOpen(false);
        }
    };

    const handleSubmitFaculty = async (data: CreateFacultyDto) => {
        if (editingItem && editingItem.type === 'faculties') {
            await facultiesHook.onEditFaculty(editingItem.index, data);
            toast.success('Faculty updated successfully');
        } else {
            await facultiesHook.onAddFaculty(data);
            toast.success('Faculty created successfully');
        }
    };

    const handleSubmitSchool = async (data: CreateSchoolDto) => {
        if (editingItem && editingItem.type === 'schools') {
            await schoolsHook.onEditSchool(editingItem.index, data);
            toast.success('School updated successfully');
        } else {
            await schoolsHook.onAddSchool(data);
            toast.success('School created successfully');
        }
    };

    const handleSubmitCertificationProgram = async (data: CreateCertificationProgramDto) => {
        if (editingItem && editingItem.type === 'certifications') {
            await programsHook.onEditCertificationProgram(editingItem.index, data);
            toast.success('Certification program updated successfully');
        } else {
            await programsHook.onAddCertificationProgram(data);
            toast.success('Certification program created successfully');
        }
    };

    const tabs = [
        { key: 'faculties' as const, label: 'Faculties', icon: Building2, color: 'blue' },
        { key: 'schools' as const, label: 'Schools', icon: GraduationCap, color: 'green' },
        { key: 'certifications' as const, label: 'Certification Programs', icon: Award, color: 'purple' },
    ];

    const getItemName = (item: Faculty | School | CertificationProgram) => {
        return item.name;
    };

    const getItemCode = (item: Faculty | School | CertificationProgram) => {
        return item.code;
    };

    const getItemDescription = (item: Faculty | School | CertificationProgram) => {
        return item.description;
    };

    const getItemDetails = (item: Faculty | School | CertificationProgram, type: TabType) => {
        switch (type) {
            case 'faculties': {
                const faculty = item as Faculty;
                return [
                    faculty.dean && { icon: User, text: `Dean: ${faculty.dean}` },
                    faculty.establishedYear && { icon: Calendar, text: `Est. ${faculty.establishedYear}` },
                ].filter(Boolean);
            }
            case 'schools': {
                const school = item as School;
                return [
                    school.director && { icon: User, text: `Director: ${school.director}` },
                    school.establishedYear && { icon: Calendar, text: `Est. ${school.establishedYear}` },
                ].filter(Boolean);
            }
            case 'certifications': {
                const program = item as CertificationProgram;
                return [
                    { icon: Award, text: program.level },
                    program.duration && { icon: Calendar, text: `${program.duration} months` },
                    program.credits && { icon: GraduationCap, text: `${program.credits} credits` },
                ].filter(Boolean);
            }
            default:
                return [];
        }
    };


    const getTabIcon = (tabKey: TabType) => {
        const tab = tabs.find(t => t.key === tabKey);
        return tab?.icon || Building2;
    };

    const getTabColor = (tabKey: TabType) => {
        const tab = tabs.find(t => t.key === tabKey);
        return tab?.color || 'blue';
    };

    const getDeleteMessage = () => {
        if (!deleteItem) return '';
        const item = currentData[deleteItem.type][deleteItem.index];
        if (!item) return '';

        const typeLabel = {
            faculties: 'faculty',
            schools: 'school',
            certifications: 'certification program',
        }[deleteItem.type];

        return `Are you sure you want to delete "${getItemName(item)}"? This action cannot be undone.`;
    };

    const renderEmptyState = (type: TabType) => {
        const config = {
            faculties: {
                icon: Building2,
                title: 'No faculties yet',
                description: 'Faculties are major academic divisions within your institution. Create your first faculty to organize your academic structure.',
                buttonText: 'Create First Faculty',
            },
            schools: {
                icon: GraduationCap,
                title: 'No schools yet',
                description: 'Schools are specialized units within faculties. Create your first school to further organize your academic offerings.',
                buttonText: 'Create First School',
            },
            certifications: {
                icon: Award,
                title: 'No certification programs yet',
                description: 'Certification programs offer specialized credentials. Create your first program to expand your educational offerings.',
                buttonText: 'Create First Program',
            },
        }[type];

        const IconComponent = config.icon;

        return (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">{config.title}</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    {config.description}
                </p>
                <button
                    onClick={handleOpenAddModal}
                    disabled={currentLoading[type]}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    <span>{config.buttonText}</span>
                </button>
            </div>
        );
    };

    const renderItems = () => {
        const items = currentData[activeTab];
        const loading = currentLoading[activeTab];
        const IconComponent = getTabIcon(activeTab);
        const color = getTabColor(activeTab);

        if (loading && items.length === 0) {
            return <AcademicUnitsSkeleton count={4} />;
        }

        if (items.length === 0) {
            return renderEmptyState(activeTab);
        }

        return (
            <div className="space-y-3">
                {items.map((item, index) => {
                    const details = getItemDetails(item, activeTab);

                    return (
                        <div
                            key={item._id ?? `${activeTab}-${index}`}
                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all bg-gray-50/30"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`flex-shrink-0 w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                                        <IconComponent className={`h-4 w-4 text-${color}-600`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-medium text-gray-900 truncate">
                                            {getItemName(item)} {getItemCode(item) && <span className="text-gray-500">({getItemCode(item)})</span>}
                                        </h4>
                                        {getItemDescription(item) && (
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{getItemDescription(item)}</p>
                                        )}
                                        {details.length > 0 && (
                                            <div className="flex flex-wrap gap-3 mt-2">
                                                {details.map((detail, idx) => {
                                                    if (!detail) return null;
                                                    const DetailIcon = detail.icon;
                                                    return (
                                                        <div key={idx} className="flex items-center space-x-1 text-xs text-gray-500">
                                                            <DetailIcon className="h-3 w-3" />
                                                            <span>{detail.text}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 ml-4">
                                    <button
                                        onClick={() => handleOpenEditModal(index)}
                                        disabled={loading}
                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50"
                                        title={`Edit ${activeTab.slice(0, -1)}`}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(index)}
                                        disabled={loading}
                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                        title={`Delete ${activeTab.slice(0, -1)}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Academic Units</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage your institution&apos;s faculties, schools, and certification programs
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleRefresh}
                                disabled={currentLoading[activeTab]}
                                className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                <span>Refresh</span>
                            </button>

                            <button
                                onClick={handleOpenAddModal}
                                disabled={currentLoading[activeTab]}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add {tabs.find(t => t.key === activeTab)?.label.slice(0, -1) || 'Item'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                const isActive = activeTab === tab.key;
                                const count = currentData[tab.key].length;

                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${isActive
                                            ? `border-${tab.color}-500 text-${tab.color}-600`
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <IconComponent className="h-4 w-4" />
                                        <span>{tab.label}</span>
                                        {count > 0 && (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? `bg-${tab.color}-100 text-${tab.color}-800` : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    {renderItems()}
                </div>
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => {
                    setConfirmOpen(false);
                    setDeleteItem(null);
                }}
                onConfirm={confirmDelete}
                title={`Delete ${deleteItem?.type.slice(0, -1).charAt(0).toUpperCase()}${deleteItem?.type.slice(1, -1)}`}
                message={getDeleteMessage()}
            />

            {/* Faculty Modal */}
            {activeTab === 'faculties' && (
                <FacultyFormModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSubmit={handleSubmitFaculty}
                    faculty={editingItem?.type === 'faculties' ? (editingItem.item as Faculty) : null}
                    title={editingItem?.type === 'faculties' ? 'Edit Faculty' : 'Add Faculty'}
                />
            )}

            {/* School Modal */}
            {activeTab === 'schools' && (
                <SchoolFormModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSubmit={handleSubmitSchool}
                    school={editingItem?.type === 'schools' ? (editingItem.item as School) : null}
                    title={editingItem?.type === 'schools' ? 'Edit School' : 'Add School'}
                    faculties={facultiesHook.faculties}
                />
            )}

            {/* Certification Program Modal */}
            {activeTab === 'certifications' && (
                <CertificationProgramFormModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSubmit={handleSubmitCertificationProgram}
                    program={editingItem?.type === 'certifications' ? (editingItem.item as CertificationProgram) : null}
                    title={editingItem?.type === 'certifications' ? 'Edit Certification Program' : 'Add Certification Program'}
                    faculties={facultiesHook.faculties}
                    schools={schoolsHook.schools}
                    departments={departmentsHook.departments}
                />
            )}
        </>
    );
};

export default AcademicUnitsSettings;
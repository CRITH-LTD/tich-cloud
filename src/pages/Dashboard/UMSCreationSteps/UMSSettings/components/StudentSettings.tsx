import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
    Plus,
    Users,
    UserCircle,
    Phone,
    GraduationCap,
    Edit,
    Trash2,
    RefreshCw,
    Calendar,
    Building2,
    Info,
    Search,
    Filter,
    X,
} from 'lucide-react';

import ConfirmDialog from '../../../../../components/Common/ConfirmDialog';
import { usePrograms } from '../../../../../hooks/usePrograms';
import ShimmerLoader from '../../../../../components/Common/ShimmerLoader ';
import { Student, CreateStudentDto } from '../../../../../interfaces/types';
import { fmtPhone, fmtDate } from '../../../../../utils';
import { useStudents } from './RoleDrawing/hooks/useStudents';
import StudentFormModal from './StudentFormModal';





// ----- Skeletons
const StudentCardSkeleton: React.FC = () => (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                    <ShimmerLoader width={140} height={16} />
                    <ShimmerLoader width={100} height={12} />
                    <ShimmerLoader width={120} height={12} />
                </div>
            </div>
            <div className="flex gap-1">
                <ShimmerLoader width={32} height={32} borderRadius={8} />
                <ShimmerLoader width={32} height={32} borderRadius={8} />
            </div>
        </div>
    </div>
);

const StudentsSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => <StudentCardSkeleton key={i} />)}
    </div>
);


// ----- Main Page Component
const StudentSettings: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const pendingDeleteRef = useRef<number | null>(null);
    const [editing, setEditing] = useState<{ student: Student; index: number } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProgram, setSelectedProgram] = useState<string>('');

    // data hooks
    const { programs, refreshPrograms, loading: programsLoading, error: programsError } = usePrograms();
    const {
        students: studentData,
        loading,
        error,
        onAddStudent,
        onEditStudent,
        onDeleteStudent,
        refreshStudents,
    } = useStudents();

    // stable array
    const students: Student[] = Array.isArray(studentData) ? studentData : [];

    // Filtered students
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = !searchTerm || 
                student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.phone.includes(searchTerm);
            
            const matchesProgram = !selectedProgram || student.program === selectedProgram;
            
            return matchesSearch && matchesProgram;
        });
    }, [students, searchTerm, selectedProgram]);

    // first load
    const didInit = useRef(false);
    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;
        (async () => {
            await Promise.allSettled([refreshPrograms(), refreshStudents()]);
        })();
    }, [refreshPrograms, refreshStudents]);

    // toasts
    useEffect(() => { if (error) toast.error(error); }, [error]);
    useEffect(() => { if (programsError) toast.error(programsError); }, [programsError]);

    const handleOpenAdd = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (index: number) => {
        const student = students[index];
        if (!student) return;
        setEditing({ student, index });
        setModalOpen(true);
    };

    const handleSubmit = async (dto: CreateStudentDto) => {
        if (editing) {
            await onEditStudent(editing.index, dto);
            toast.success('Student updated successfully');
        } else {
            await onAddStudent(dto);
            toast.success('Student registered successfully');
        }
        await refreshStudents();
    };

    const requestDelete = (index: number) => {
        pendingDeleteRef.current = index;
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        const idx = pendingDeleteRef.current;
        if (idx == null) return;
        try {
            await onDeleteStudent(idx);
            toast.success('Student deleted successfully');
            await refreshStudents();
        } finally {
            setConfirmOpen(false);
            pendingDeleteRef.current = null;
        }
    };

    const getProgramName = (programId: string) => {
        return programs.find(p => p._id === programId)?.name || 'Unknown Program';
    };

    const HeaderRight = useMemo(
        () => (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => refreshStudents()}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
                <button
                    onClick={handleOpenAdd}
                    disabled={loading || programsLoading || programs.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Student</span>
                </button>
            </div>
        ),
        [loading, programsLoading, programs.length, refreshStudents]
    );

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                                <p className="text-sm text-gray-500">Manage student registrations and academic enrollment</p>
                            </div>
                        </div>
                        {HeaderRight}
                    </div>

                    {/* Empty programs guard */}
                    {(!programsLoading && programs.length === 0) && (
                        <div className="mb-4 p-3 rounded-md bg-amber-50 text-amber-800 text-sm">
                            No programs found. Create a program first to register students.
                        </div>
                    )}

                    {/* Search and Filter Controls */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by name, matricule, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                        {/* Program Filter */}
                        <div className="sm:w-64 relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <select
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                                <option value="">All Programs</option>
                                {programs.map(program => (
                                    <option key={program._id} value={program._id}>
                                        {program.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Summary */}
                    {(searchTerm || selectedProgram) && (
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {filteredStudents.length} of {students.length} students
                            {searchTerm && ` matching "${searchTerm}"`}
                            {selectedProgram && ` in ${getProgramName(selectedProgram)}`}
                        </div>
                    )}

                    {/* Content */}
                    {loading && students.length === 0 ? (
                        <StudentsSkeleton />
                    ) : filteredStudents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredStudents.map((student, idx) => {
                                // Find original index for edit/delete operations
                                const originalIndex = students.findIndex(s => s._id === student._id);
                                
                                return (
                                    <div key={student._id ?? `student-${idx}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md bg-white transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {student.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-medium text-gray-900 truncate">{student.fullName}</h4>
                                                    <p className="text-xs text-gray-500">Mat: {student.matricule}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleOpenEdit(originalIndex)}
                                                    disabled={loading}
                                                    title="Edit student"
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg disabled:opacity-50 transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => requestDelete(originalIndex)}
                                                    disabled={loading}
                                                    title="Delete student"
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            {/* Contact Info */}
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span>{fmtPhone(student.phone)}</span>
                                            </div>

                                            {/* Program */}
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <GraduationCap className="h-4 w-4 text-gray-400" />
                                                <span className="truncate">{getProgramName(student.program)}</span>
                                            </div>

                                            {/* Registration Date */}
                                            {student.createdAt && (
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span>Registered {fmtDate(student.createdAt)}</span>
                                                </div>
                                            )}

                                            {/* Custom Fields Preview */}
                                            {student.customFields && Object.keys(student.customFields).length > 0 && (
                                                <div className="pt-2 border-t border-gray-100">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                        <Info className="h-3 w-3" />
                                                        <span>Additional Info</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {Object.entries(student.customFields).slice(0, 2).map(([key, value]) => (
                                                            <div key={key} className="flex text-xs">
                                                                <span className="text-gray-500 capitalize">{key.replace('_', ' ')}:</span>
                                                                <span className="text-gray-700 ml-1 truncate">{String(value)}</span>
                                                            </div>
                                                        ))}
                                                        {Object.keys(student.customFields).length > 2 && (
                                                            <div className="text-xs text-gray-400">
                                                                +{Object.keys(student.customFields).length - 2} more fields
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                                <Users className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg text-gray-900 mb-2">No students registered yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                Start building your student database by registering students into your academic programs.
                            </p>
                            <button
                                onClick={handleOpenAdd}
                                disabled={loading || programsLoading || programs.length === 0}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Register First Student</span>
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg text-gray-900 mb-2">No students found</h3>
                            <p className="text-gray-500 mb-4">
                                Try adjusting your search criteria or filters.
                            </p>
                            <div className="flex justify-center gap-3">
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Clear search
                                    </button>
                                )}
                                {selectedProgram && (
                                    <button
                                        onClick={() => setSelectedProgram('')}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Clear program filter
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Statistics Card */}
                {students.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Statistics Overview
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-700">{students.length}</div>
                                <div className="text-sm text-blue-600">Total Students</div>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-indigo-700">
                                    {new Set(students.map(s => s.program)).size}
                                </div>
                                <div className="text-sm text-indigo-600">Active Programs</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-700">
                                    {students.filter(s => s.createdAt && new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                                </div>
                                <div className="text-sm text-green-600">New This Month</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <StudentFormModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditing(null);
                }}
                onSubmit={handleSubmit}
                programs={programs}
                student={editing?.student ?? null}
                title={editing ? 'Edit Student' : 'Add Student'}
            />

            {/* Confirm Delete */}
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => { setConfirmOpen(false); pendingDeleteRef.current = null; }}
                onConfirm={confirmDelete}
                title="Delete student?"
                message="This student will be removed from the system. This action cannot be undone."
            />
        </>
    );
};

export default StudentSettings;
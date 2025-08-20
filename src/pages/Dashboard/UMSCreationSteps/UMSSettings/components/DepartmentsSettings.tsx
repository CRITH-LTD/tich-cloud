import React, { useState, useEffect, useMemo, act } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  RefreshCcw,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Users,
  Calendar,
  ChevronDown,
  X,
  MoreVertical,
  ArrowUpDown,
  Download,
  Building,
  GraduationCap,
  Award,
  BarChart3,
  ChevronsUpDownIcon,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';
import DepartmentsSkeleton from './DepartmentsSkeleton';
import ConfirmDialog from '../../../../../components/Common/ConfirmDialog';
import DepartmentFormModal from './DepartmentModal';
import { useDepartments } from '../../../../../hooks/useDepartments';
import {
  useFaculties,
  useSchools,
  useCertificationPrograms,
} from '../../../../../hooks/useAcademicUnits';
import { CreateDepartmentDto, Department } from '../../../../../types/department.types';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Tab } from '@headlessui/react';

type ParentType = 'Faculty' | 'School' | 'CertificationProgram';
type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'code' | 'students' | 'rating' | 'established';
type FilterStatus = 'all' | 'active' | 'inactive';

interface TabConfig {
  key: ParentType;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  gradient: string;
}

const tabs: TabConfig[] = [
  {
    key: 'Faculty',
    label: 'Faculties',
    icon: Building,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    key: 'School',
    label: 'Schools',
    icon: GraduationCap,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    key: 'CertificationProgram',
    label: 'Certification Programs',
    icon: Award,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    gradient: 'from-purple-500 to-indigo-600',
  },
];

const DepartmentsSettings: React.FC = () => {
  // Core state
  const [activeTab, setActiveTab] = useState<ParentType>('Faculty');
  const [parentId, setParentId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<{ department: Department; index: number } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());

  // Bulk operations
  const [showBulkActions, setShowBulkActions] = useState(false);

  const { faculties, refreshFaculties } = useFaculties();
  const { schools, refreshSchools } = useSchools();
  const { certificationPrograms, refreshCertificationPrograms } = useCertificationPrograms();

  const {
    departments,
    loading,
    error,
    onAddDepartment,
    onEditDepartment,
    onDeleteDepartment,
    refreshDepartments,
    filteredDepartments,
    departmentStats,
    onBulkDelete,
    onBulkStatusUpdate,
  } = useDepartments({
  mode: 'scoped',
  parentId: parentId ?? '',
  parentType: activeTab,
  initialFilters: { searchQuery, sortBy, sortOrder, filterStatus },
});

  const currentTabConfig = tabs.find(tab => tab.key === activeTab)!;

  const parentOptions = activeTab === 'Faculty'
    ? faculties
    : activeTab === 'School'
      ? schools
      : certificationPrograms;

  // Statistics computation
  const stats = useMemo(() => {
    if (!departments.length) return null;

    const total = departments.length;
    const active = departments.filter(d => d.status === 'active').length;
    const totalStudents = departments.reduce((sum, d) => sum + (d.studentCount || 0), 0);
    const avgRating = departments.reduce((sum, d) => sum + (d.rating || 0), 0) / total;

    return {
      total,
      active,
      inactive: total - active,
      totalStudents,
      avgRating: avgRating.toFixed(1),
      ...departmentStats,
    };
  }, [departments, departmentStats]);

  // Prefetch all parent lists
  useEffect(() => {
    refreshFaculties();
    refreshSchools();
    refreshCertificationPrograms();
  }, []);

  // Refresh departments when tab or parent changes
  useEffect(() => {
    setParentId(undefined);
    setSearchQuery('');
    setSelectedDepartments(new Set());
    if (parentId) {
      refreshDepartments().catch(console.error);
    }
  }, [activeTab]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    setShowBulkActions(selectedDepartments.size > 0);
  }, [selectedDepartments]);

  const isReady = Boolean(parentId);

  const handleAddOrUpdate = async (dto: CreateDepartmentDto) => {
    try {
      if (editingDepartment) {
        await onEditDepartment(editingDepartment.index, dto);
        toast.success('Department updated successfully');
      } else {
        await onAddDepartment(dto);
        toast.success('Department created successfully');
      }
      refreshDepartments();
    } catch {
      // error handled in hook
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex == null) return;
    try {
      await onDeleteDepartment(deleteIndex);
      toast.success('Department deleted');
      refreshDepartments();
    } catch {
      // handled
    } finally {
      setDeleteIndex(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedDepartments.size) return;
    try {
      await onBulkDelete(Array.from(selectedDepartments));
      toast.success(`${selectedDepartments.size} departments deleted`);
      setSelectedDepartments(new Set());
      refreshDepartments();
    } catch {
      // handled
    }
  };

  const handleSelectAll = () => {
    if (selectedDepartments.size === filteredDepartments.length) {
      setSelectedDepartments(new Set());
    } else {
      setSelectedDepartments(new Set(filteredDepartments.map(d => d._id)));
    }
  };

  const toggleDepartmentSelection = (id: string) => {
    const newSelection = new Set(selectedDepartments);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedDepartments(newSelection);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const openAddModal = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
    refreshDepartments(true);
  };
  const openEditModal = (idx: number) => {
    setEditingDepartment({ department: filteredDepartments[idx], index: idx });
    setIsModalOpen(true);
  };


  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="backdrop-blur-xl bg-white/80 rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Department Management
              </h1>
              <p className="text-slate-600 mt-2">Organize and manage academic departments across your institution</p>
            </div>

            {/* Quick Stats */}
            {stats && isReady && (
              <div className="flex gap-4">
                <div className="backdrop-blur-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-200/20">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
                      <div className="text-sm text-slate-600">Total Departments</div>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg p-4 border border-emerald-200/20">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="text-2xl font-bold text-slate-800">{stats.totalStudents}</div>
                      <div className="text-sm text-slate-600">Total Students</div>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-4 border border-purple-200/20">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-slate-800">{stats.avgRating}</div>
                      <div className="text-sm text-slate-600">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Tabs */}
          <div className="flex space-x-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`group relative px-6 py-3 rounded-md font-semibold transition-all duration-300 transform ${isActive
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md shadow-${tab.key === 'Faculty' ? 'blue' : tab.key === 'School' ? 'emerald' : 'purple'}-500/25 scale-105`
                    : 'hover:bg-white/50 text-slate-600 hover:text-slate-800 hover:scale-105'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : tab.color}`} />
                    <span className='text-sm font-medium'>{tab.label}</span>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
          {/* Parent Selector via Tabs */}
          <div className="mb-6">
            <label className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
              <currentTabConfig.icon className={`h-5 w-5 ${currentTabConfig.color}`} />
              Select {currentTabConfig.label.slice(0, -1)}:
            </label>

            {/* Ensure a parent is preselected if none */}
            {useMemo(() => null, [parentOptions]) /* noop to keep eslint quiet */}
            {useEffect(() => {
              if (!parentId && parentOptions.length > 0) {
                setParentId(parentOptions[0]._id);
              }
            }, [parentId, parentOptions, setParentId])}

            {parentOptions.length === 0 ? (
              <div className="text-slate-500 bg-white/70 border border-gray-200 rounded-md px-4 py-3">
                No {currentTabConfig.label.toLowerCase()} available.
              </div>
            ) : (
              <Tab.Group
                // map selected tab index -> parentId
                onChange={(idx) => {
                  const next = parentOptions[idx];
                  if (next?._id) setParentId(next._id);
                }}
                // control selected index based on parentId
                selectedIndex={
                  Math.max(
                    0,
                    parentOptions.findIndex((u) => u._id === parentId)
                  )
                }
              >
                <Tab.List className="flex items-center gap-2 overflow-x-auto rounded-md bg-white/60 p-2 border border-gray-200">
                  {parentOptions.map((unit) => (
                    <Tab
                      key={unit._id}
                      className={({ selected }) =>
                        [
                          'whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all',
                          'outline-none ring-0 focus-visible:ring-2 focus-visible:ring-blue-500/40',
                          selected
                            ? `bg-gradient-to-r ${currentTabConfig.gradient} text-white shadow-sm`
                            : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200',
                        ].join(' ')
                      }
                    >
                      <span className="inline-flex items-center gap-2">
                        {unit.name}
                        {parentId === unit._id && <Check className="h-4 w-4" />}
                      </span>
                    </Tab>
                  ))}
                </Tab.List>

                {/* Optional panels (not strictly needed if you're only selecting) */}
                <Tab.Panels className="mt-2">
                  {parentOptions.map((unit) => (
                    <Tab.Panel key={unit._id}>
                      {/* You can put contextual info here, or leave empty */}
                      <div className="sr-only">{unit.name}</div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            )}
          </div>


          {/* Main Content */}
          {!isReady ? (
            <div className="backdrop-blur-xl bg-white/80 rounded-lg border border-gray-200 p-12 text-center">
              <currentTabConfig.icon className={`h-24 w-24 ${currentTabConfig.color} mx-auto mb-4 opacity-50`} />
              <h3 className="text-2xl font-bold text-slate-700 mb-2">Ready to Begin</h3>
              <p className="text-slate-600">Select a {currentTabConfig.label.toLowerCase().slice(0, -1)} above to view and manage departments.</p>
            </div>
          ) : loading && departments.length === 0 ? (
            <DepartmentsSkeleton count={6} />
          ) : (
            <div className="space-y-6">

              {/* Controls Bar */}
              <div className="backdrop-blur-xl bg-white/80 rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

                  {/* Left Side - Search and Filters */}
                  <div className="flex flex-1 gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search color='black' className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 " />
                      <input
                        type="text"
                        placeholder="Search departments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 backdrop-blur-lg bg-white/70 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Filters Toggle */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${showFilters || filterStatus !== 'all'
                        ? `bg-gradient-to-r ${currentTabConfig.gradient} text-white shadow-lg`
                        : 'bg-white/70 text-slate-700 border border-white/30 hover:bg-white/90'
                        }`}
                    >
                      <Filter className="h-4 w-4" />
                      <span>Filters</span>
                    </button>

                    {/* Sort */}
                    <div className="relative">
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-');
                          setSortBy(field as SortOption);
                          setSortOrder(order as 'asc' | 'desc');
                        }}
                        className="appearance-none backdrop-blur-lg bg-white/70 border border-white/30 rounded-xl px-4 py-3 pr-10 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                      >
                        <option value="name-asc">Name A-Z</option>
                        <option value="name-desc">Name Z-A</option>
                        <option value="students-desc">Most Students</option>
                        <option value="rating-desc">Highest Rated</option>
                        <option value="established-desc">Newest First</option>
                      </select>
                      <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Right Side - View Controls and Actions */}
                  <div className="flex items-center gap-3">

                    {/* View Mode Toggle */}
                    <div className="flex rounded-xl bg-white/70 border border-white/30 p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                          ? `bg-gradient-to-r ${currentTabConfig.gradient} text-white shadow-lg`
                          : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                          ? `bg-gradient-to-r ${currentTabConfig.gradient} text-white shadow-lg`
                          : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Bulk Actions */}
                    {showBulkActions && (
                      <div className="flex items-center gap-2 animate-in slide-in-from-right">
                        <span className="text-sm font-medium text-slate-600">
                          {selectedDepartments.size} selected
                        </span>
                        <button
                          onClick={handleBulkDelete}
                          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}

                    {/* Refresh */}
                    <button
                      onClick={() => refreshDepartments(true).catch((e) => console.error(e))}
                      disabled={loading}
                      className="p-3 flex gap-2 border-solid backdrop-blur-lg bg-white/70 border  rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all group"
                    >
                      <span className='text-xs'>Refresh</span> <RefreshCcw className={`h-4 w-4 text-slate-600 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    </button>

                    {/* Add Button */}
                    <button
                      onClick={openAddModal}
                      disabled={loading}
                      className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentTabConfig.gradient} text-white rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all font-semibold`}
                    >
                      <span className='text-xs'>Add Department</span>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Extended Filters */}
                {showFilters && (
                  <div className="mt-6 pt-6 border-t border-white/20 animate-in slide-in-from-top">
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-700">Status:</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                          className="px-3 py-2 backdrop-blur-lg bg-white/70 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active Only</option>
                          <option value="inactive">Inactive Only</option>
                        </select>
                      </div>

                      {(searchQuery || filterStatus !== 'all') && (
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Bulk Selection */}
                {filteredDepartments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.size === filteredDepartments.length}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
                      />
                      <span>Select All Departments</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Departments Grid/List */}
              <div className="backdrop-blur-xl bg-white/80 rounded-xl border border-white/20 shadow-md p-6">
                {filteredDepartments.length ? (
                  <div className={`${viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                    }`}>
                    {filteredDepartments.map((d, i) => {
                      const isSelected = selectedDepartments.has(d._id);

                      return viewMode === 'grid' ? (
                        // Grid View Card
                        <div
                          key={d._id}
                          className={`group relative backdrop-blur-lg bg-gradient-to-br from-white/90 to-white/70 rounded-md p-6 hover:shadow-sm hover:scale-105 transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500/50 shadow-md shadow-blue-500/20' : ''}`}
                          style={{ border: "1px solid gainsboro" }}
                        >

                          {/* Selection Checkbox */}
                          <div className="absolute top-4 left-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleDepartmentSelection(d._id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
                            />
                          </div>

                          {/* Actions Menu */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditModal(i)}
                                disabled={loading}
                                className="p-2 backdrop-blur-lg bg-white/70 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 transition-all"
                                title="Edit Department"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteIndex(i);
                                  setConfirmOpen(true);
                                }}
                                disabled={loading}
                                className="p-2 backdrop-blur-lg bg-white/70 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-all"
                                title="Delete Department"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Department Info */}
                          <div className="mt-8 space-y-4">
                            <div>
                              <h3 className="font-bold text-lg text-slate-800 group-hover:text-slate-900 transition-colors">
                                {d.name}
                              </h3>
                              {d.code && (
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentTabConfig.gradient} text-white mt-1`}>
                                  {d.code}
                                </div>
                              )}
                            </div>

                            {d.description && (
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {d.description}
                              </p>
                            )}

                            {/* Stats Row */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/20">
                              <div className="flex items-center gap-4 text-sm">
                                {d.studentCount && (
                                  <div className="flex items-center gap-1 text-slate-600">
                                    <Users className="h-4 w-4" />
                                    <span>{d.studentCount}</span>
                                  </div>
                                )}

                                {d.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="text-slate-600">{d.rating}</span>
                                  </div>
                                )}
                              </div>

                              {/* Status Badge */}
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                                }`}>
                                {d.status || 'Active'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // List View Row
                        <div
                          key={d._id}
                          className={`group backdrop-blur-lg bg-gradient-to-r from-white/90 to-white/70 rounded-lg p-6 hover:shadow-md transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20' : ''}`}
                          style={{ border: "1px solid gainsboro", overflow: "hidden" }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              {/* Checkbox */}
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleDepartmentSelection(d._id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
                              />

                              {/* Department Info */}
                              <div className="flex-1 min-w-0 max-w-[50vw]">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-lg text-slate-800 truncate">
                                    {d.name}
                                  </h3>
                                  {d.code && (
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentTabConfig.gradient} text-white`}>
                                      {d.code}
                                    </div>
                                  )}
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {d.status || 'Active'}
                                  </div>
                                </div>

                                {d.description && (
                                  <p className="text-sm text-slate-600 truncate">
                                    {d.description}
                                  </p>
                                )}
                              </div>

                              {/* Stats */}
                              <div className="flex items-center gap-6 text-sm text-slate-600">
                                {d.studentCount && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{d.studentCount} students</span>
                                  </div>
                                )}

                                {d.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span>{d.rating}/5</span>
                                  </div>
                                )}

                                {d.establishedDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(d.establishedDate).getFullYear()}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(i)}
                                disabled={loading}
                                className="p-2 backdrop-blur-lg bg-white/70 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 transition-all"
                                title="Edit Department"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteIndex(i);
                                  setConfirmOpen(true);
                                }}
                                disabled={loading}
                                className="p-2 backdrop-blur-lg bg-white/70 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-all"
                                title="Delete Department"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 backdrop-blur-lg bg-white/70 text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                                title="More Actions"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center mb-6">
                      <currentTabConfig.icon className={`h-12 w-12 ${currentTabConfig.color} opacity-50`} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No Departments Found</h3>
                    <p className="text-slate-500 mb-6">
                      {searchQuery || filterStatus !== 'all'
                        ? 'No departments match your current filters. Try adjusting your search criteria.'
                        : 'This unit doesn\'t have any departments yet. Create the first one to get started.'
                      }
                    </p>

                    {(searchQuery || filterStatus !== 'all') && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Results Summary */}
              {isReady && (
                <div className="flex items-center justify-between text-sm text-slate-600 px-6">
                  <div>
                    Showing {filteredDepartments.length} of {departments.length} departments
                    {searchQuery && (
                      <span> for "{searchQuery}"</span>
                    )}
                  </div>

                  {filteredDepartments.length > 0 && (
                    <button
                      onClick={() => {
                        // Export functionality would go here
                        toast.info('Export functionality coming soon!');
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <ConfirmDialog
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Department"
          message={`Are you sure you want to delete "${departments[deleteIndex!]?.name}"? This action cannot be undone.`}
        />

        <DepartmentFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAddOrUpdate}
          department={editingDepartment?.department ?? null}
          title={editingDepartment ? 'Edit Department' : 'Add New Department'}
        />
      </div>
    </div>
  );
};

export default DepartmentsSettings;
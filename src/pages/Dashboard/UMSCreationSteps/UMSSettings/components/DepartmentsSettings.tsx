import { Plus, Edit, Trash2, School2Icon } from "lucide-react";
import { Card } from "./common";
import { UMSForm } from "../../../../../interfaces/types";

interface DepartmentsSettingsProps {
  formData: UMSForm;
  onAddDepartment: () => void;
  onEditDepartment: (index: number) => void;
  onDeleteDepartment: (index: number) => void;
}

const DepartmentsSettings: React.FC<DepartmentsSettingsProps> = ({
  formData,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment
}) => (
  <div className="space-y-6">
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Departments</h3>
        <button
          onClick={onAddDepartment}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="space-y-4">
        {formData?.departments?.map((dept, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <School2Icon className="h-5 w-5 text-green-600" />
                <div>
                  <span className="font-medium text-gray-900">{dept.name}</span>
                  {dept.description && (
                    <p className="text-sm text-gray-500">{dept.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => onEditDepartment(index)} className="p-1 text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => onDeleteDepartment(index)} className="p-1 text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default DepartmentsSettings;

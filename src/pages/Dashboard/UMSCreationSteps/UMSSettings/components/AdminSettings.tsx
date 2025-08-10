import { UMSForm } from "../../../../../interfaces/types";
import { Card, FormInput } from "./common";

interface AdminSettingsProps {
  formData: UMSForm;
  onInputChange: <K extends keyof UMSForm>(field: K, value: UMSForm[K]) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({
  formData,
  onInputChange
}) => (
  <div className="space-y-6">
    <Card title="Administrator Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Admin Name"
          value={formData.adminName}
          onChange={(value) => onInputChange('adminName', value)}
          required
        />
        
        <FormInput
          label="Email"
          type="email"
          value={formData.adminEmail}
          onChange={(value) => onInputChange('adminEmail', value)}
          disabled
        />

        <FormInput
          label="Phone"
          type="tel"
          value={formData.adminPhone || ""}
          onChange={(value) => onInputChange('adminPhone', value)}
        />
      </div>
    </Card>
  </div>
);

export default AdminSettings;
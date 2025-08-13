
import { useUMSManagement } from '../pages/Dashboard/dashboard.hooks';
import { UMSForm } from '../interfaces/types';

interface MatriculeConfig {
    format?: string;
    placeholders?: Record<string, string>;
    sequenceLength?: number;
}

interface useMatriculeProps {
    onInputChange:<K extends keyof UMSForm>(field: K, value: UMSForm[K]) => void;
}

export const useMatricule = ({onInputChange}: useMatriculeProps) => {
    const {
            intro,
            introLoading,
            error,
        } = useUMSManagement();
    // kk here, I shall elicit matricule config from UMS data
    const matriculeConfig = intro?.matriculeConfig || {
        format: '',
        placeholders: {},
        sequenceLength: 4
    };

    const handleConfigChange = (config: MatriculeConfig) => {
        onInputChange('matriculeConfig', config);
    };

    return {
        matriculeConfig,
        introLoading,
        error,
        handleConfigChange
    };
};
import { ModuleSelector } from "../../../components/ModuleSelector";
import { useCreateUMS } from "../dashboard.hooks";


const StepThree = () => {
    const {
        form,
        toggleModule,
    } = useCreateUMS();
   
    return <ModuleSelector onToggleModule={toggleModule} selectedModules={form.modules} />
};

export default StepThree;

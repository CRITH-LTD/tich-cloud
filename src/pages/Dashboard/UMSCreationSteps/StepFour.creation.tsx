import MainPlatformToggle from "../../../components/PlatformToggleCard";
import { useCreateUMS } from "../dashboard.hooks";


const StepFour = () => {
    const {
        form,
        togglePlatform,
        toggleOffice
    } = useCreateUMS();

    return (
        <MainPlatformToggle
            form={form}
            togglePlatform={togglePlatform} // Adjust "platform" to the correct field name if needed
            toggleOffice={toggleOffice} // Replace with the correct function if needed
            desktopOfficeOptions={["Finance Office",
                "Student Affairs Office",
                "Examination Office",
                "Undergraduate Office"]} // Replace with the correct options if needed
        />
    )

}

export default StepFour;
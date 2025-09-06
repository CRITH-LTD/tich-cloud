import { useCreateUMS } from "./dashboard.hooks";
import { Breadcrumbs } from "../../components/Common/Breadcrumbs";
import StepOne from "./UMSCreationSteps/StepOne.creation";
import StepTwo from "./UMSCreationSteps/StepTwo.creation";
import StepThree from "./UMSCreationSteps/StepThree.creation";
import StepFour from "./UMSCreationSteps/StepFour.creation";
import StepFive from "./UMSCreationSteps/StepFive.creation";

const steps = [
    {
        title: "Institution Info",
        description: "Provide the name and a brief description of your institution or university."
    },
    {
        title: "Admin Setup",
        description: "Set up the root administrator account that will manage your UMS environment."
    },
    {
        title: "Core Modules",
        description: "Select the academic and operational modules you want to include in your UMS."
    },
    {
        title: "Platforms & Offices",
        description: "Enable mobile apps and choose active office roles for your desktop console."
    },
    {
        title: "Review & Launch",
        description: "Review all your configurations and launch your UMS on CRITH Education Cloud."
    }
];


const CreateUMS = () => {
    const {
        step,
        goToTheStep,
        next,
        back,
    } = useCreateUMS();

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepOne />;
            case 2:
                return <StepTwo />

            case 3:
                return <StepThree />
            case 4:
                return <StepFour />

            case 5:
                return <StepFive />
        };
    }
    return (
        <>
            <div className="max-w-9xl mx-auto flex gap-8">
                {/* Step List */}
                <aside className="w-64 hidden md:block border-r pr-4 fixed top-25 left-5  h-[calc(100vh-10.5rem)] overflow-y-auto">
                    <Breadcrumbs />
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Create a University Management System</h2>
                    <ol className="space-y-2">
                        {steps.map((s, i) => {
                            const number = i + 1;
                            const isActive = step === number;
                            const isComplete = step > number;
                            // const isUpcoming = step < number;

                            return (
                                <li key={s.title} className="flex items-start gap-3">
                                    {/* Step indicator */}
                                    <div onClick={() => goToTheStep(number)} className={`flex-shrink-0 h-6 w-6 flex items-center justify-center cursor-pointer rounded-full text-xs font-medium mt-0.5 ${isComplete
                                        ? "bg-green-500 text-white"
                                        : isActive
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-600"
                                        }`}>
                                        {isComplete ? (
                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : number}
                                    </div>

                                    {/* Step content */}
                                    <div className={`pb-4 ${i !== steps.length - 1 ? 'border-l border-gray-200' : ''}`} style={{ marginLeft: '-12px', paddingLeft: '12px' }}>
                                        <p className={`text-sm font-medium ${isActive ? 'text-blue-700' : isComplete ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                            {s.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{s.description}</p>

                                        {/* Connector line */}
                                        {i !== steps.length - 1 && (
                                            <div className={`absolute h-4 w-px mt-2 ml-2.5 ${isComplete ? 'bg-green-500' : 'bg-gray-200'
                                                }`}></div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </aside>

                {/* Form Section */}
                <div className="flex-1 bg-white p-6 rounded  ml-[18rem] shadow-sm">
                    {renderStep()}
                    <div className="mt-8 flex justify-between">
                        {step > 1 && (
                            step != 5 && (<button
                                onClick={back}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                ← Back
                            </button>)
                        )}
                        {step < steps.length && (
                            <button
                                onClick={next}
                                className="ml-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                Next →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateUMS;

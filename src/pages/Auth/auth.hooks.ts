import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { logout, setCredentials, setUser } from "../../features/auth/authSlice";
import { pathnames } from "../../routes/path-names";

export type AuthIntent = "signup" | "signin";

interface AuthFormData {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    agreeToTerms?: boolean;
    subscribeToUpdates?: boolean;
}

interface UseAuthFormProps {
    intent: AuthIntent;
}

export const useAuthForm = ({ intent }: UseAuthFormProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<AuthFormData>({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: "",
        agreeToTerms: false,
        subscribeToUpdates: true,
    });

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? target.checked : value,
        }));
    };

    const checkPasswordMatch = () => {
        if (intent === "signup") {
            const mismatch = formData.password !== formData.confirmPassword;
            setPasswordMismatch(mismatch);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true)

        // Password match check for signup
        if (intent === "signup" && formData.password !== formData.confirmPassword) {
            setPasswordMismatch(true);
            toast.error("Passwords do not match", { autoClose: 3000 });
            return;
        }

        setPasswordMismatch(false);

        // Prepare payload based on auth intent
        let payload: Partial<AuthFormData> = {
            email: formData.email,
            password: formData.password,
        };

        if (intent === "signup") {
            const {
                confirmPassword,
                agreeToTerms,
                // subscribeToUpdates,
                ...rest
            } = formData;
            console.log("There are " + confirmPassword?.length + " Good Ideas Today and they are " + agreeToTerms );
            payload = { ...rest }; // remove confirmPassword, agreeToTerms, subscribeToUpdates
        }

        try {
            const endpoint = intent === "signup" ? "/auth/root/create" : "/auth/root/login";
            const res = await api.post(endpoint, payload);

            if (res.status === 200 || res.status === 201) {
                const token = res.data.access_token;
                dispatch(setCredentials({ accessToken: token }));

                // Fetch current user profile
                try {
                    const meRes = await api.get("/users/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (meRes?.data) {
                        dispatch(setUser(meRes.data)); // Define setUser in your authSlice
                    }
                } catch (meErr) {
                    console.error("Failed to fetch user:", meErr);
                    toast.error("Failed to load user profile", { autoClose: 3000 });
                }

                toast.success("Authenticated successfully!", { autoClose: 2000 });
                navigate(pathnames.DASHBOARD);
            } else {
                console.log("Unexpected response:", res);
                toast.error("Unexpected response. Please try again.", { autoClose: 3000 });
                toast.error(res.toString(), { autoClose: 3000 });
            }

        } catch (error: unknown) {
            const fallbackMessage = "Something went wrong. Please try again.";

            interface AxiosErrorLike {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            }

            const isAxiosError = (error: unknown): error is AxiosErrorLike =>
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                (error as AxiosErrorLike).response !== undefined &&
                typeof (error as AxiosErrorLike).response?.data?.message === "string";

            const message = isAxiosError(error)
                ? error.response?.data?.message ?? fallbackMessage
                : fallbackMessage;

            toast.error(message, { autoClose: 4000 });
        }

        finally {
            setIsSubmitting(false);
        }
    };


    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully", { autoClose: 2000 });
        localStorage.removeItem("access_token");
        navigate("/signin");
    };

    return {
        intent,
        formData,
        showPassword,
        showConfirmPassword,
        passwordMismatch,
        handleInputChange,
        handleSubmit,
        isSubmitting,
        handleLogout,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        checkPasswordMatch,
    };
};

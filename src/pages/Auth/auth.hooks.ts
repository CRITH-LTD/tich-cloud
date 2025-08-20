import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { logout, setCredentials, setUser } from "../../features/auth/authSlice";
import { pathnames } from "../../routes/path-names";
import { ApiResponse } from "../../types/department.types";

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
        setIsSubmitting(true);

        try {
            // Password match check
            if (intent === "signup" && formData.password !== formData.confirmPassword) {
                setPasswordMismatch(true);
                toast.error("Passwords do not match", { autoClose: 3000 });
                return;
            }

            setPasswordMismatch(false);

            // Construct request payload
            let payload: Partial<AuthFormData> = {
                email: formData.email,
                password: formData.password,
            };

            if (intent === "signup") {
                const {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    confirmPassword,
                    agreeToTerms,
                    ...rest
                } = formData;

                if (!agreeToTerms) {
                    toast.error("You must agree to the terms and conditions.", { autoClose: 3000 });
                    return;
                }

                payload = { ...rest };
            }

            const endpoint = intent === "signup" ? "/auth/root/create" : "/auth/root/login";
            const res = await api.post<ApiResponse<any>>(endpoint, payload);

            if (res.status === 200 || res.status === 201 || res.data.success) {
                const token = res.data.data.access_token;
                dispatch(setCredentials({ accessToken: token }));

                try {
                    const meRes = await api.get<ApiResponse<any>>("/users/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (meRes?.data.data) {
                        dispatch(setUser(meRes.data.data));
                    }
                } catch (meErr) {
                    console.error("Failed to fetch user:", meErr);
                    toast.error("Failed to load user profile", { autoClose: 3000 });
                }

                toast.success("Authenticated successfully!", { autoClose: 2000 });
                navigate(pathnames.DASHBOARD);
            } else {
                toast.error("Unexpected response. Please try again.", { autoClose: 3000 });
                console.error("Unexpected response:", res);
            }

        } catch (err) {
            console.error("Submit error:", err);
        } finally {
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

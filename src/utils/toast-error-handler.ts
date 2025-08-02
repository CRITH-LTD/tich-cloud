// utils/toast-error-handler.ts
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

/**
 * Handles known Axios errors gracefully using toast notifications.
 * Optionally logs to console.
 */
export function handleAxiosError(
    error: unknown,
    fallbackMessage = "Something went wrong. Please try again.",
    options?: {
        silent?: boolean; // no toast
        showConsoleLog?: boolean; // for dev
    }
) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError?.response?.status === 409) {
        if (!options?.silent) toast.error("An account with this email already exists.", { autoClose: 4000 });
        return;
    }

    if (axiosError?.response?.data?.message) {
        if (!options?.silent) toast.error(axiosError.response.data.message, { autoClose: 4000 });
        return;
    }

    if (!options?.silent) {
        toast.error(fallbackMessage, { autoClose: 4000 });
    }

    if (options?.showConsoleLog) {
        console.error("Axios error:", axiosError);
    }
}

// This allows you to add properties to the global Window object.
declare global {
    interface Window {
        Sentry?: {
            captureException: (error: Error, options?: { extra: Record<string, unknown> }) => void;
        };
    }
}

// You can also add an empty export statement to make it a module.
// This is sometimes necessary depending on your tsconfig.
export { };
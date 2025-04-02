import { createContext, useState, useContext } from "react";

const ErrorContext = createContext();

/**
 * Error Context will be used to send error messages to global error modal to display.
 */
export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);

    const showError = (message) => setError(message);
    const clearError = () => setError(null);

    return (
        <ErrorContext.Provider value={{ error, showError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};


export const useError = () => useContext(ErrorContext);

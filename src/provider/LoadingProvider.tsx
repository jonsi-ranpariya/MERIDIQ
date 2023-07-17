import React, { createContext } from 'react';
import useAuth from '../hooks/useAuth';
import FullPageLoading from '../partials/Loadings/FullPageLoading';
interface LoadingProps {
    children?: React.ReactNode,
}

export const LoadingContext = createContext<{
    loading: boolean,
    // setLoading: React.Dispatch<React.SetStateAction<boolean>>,
}>({
    loading: false,
    // setLoading: () => { },
});

export const LoadingProvider: React.FC<LoadingProps> = ({ children }) => {
    // const [loading, setLoading] = React.useState(true);
    const { loading } = useAuth();

    return (
        <LoadingContext.Provider value={{ loading }}>
            {loading ? <FullPageLoading show /> : children}
        </LoadingContext.Provider>
    );
}

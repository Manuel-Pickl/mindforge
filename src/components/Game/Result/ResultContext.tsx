import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export const ResultContext = createContext<{
    result: number;
    setResult: Dispatch<SetStateAction<number>>;
} | undefined>(undefined);

export const useResultContext = () => {
    const context = useContext(ResultContext);

    if (!context) {
        throw new Error('ResultContext is not provided-');
    }

    return context;
};
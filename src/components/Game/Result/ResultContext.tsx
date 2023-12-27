import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export const ResultContext = createContext<{
    points: number;
    setPoints: Dispatch<SetStateAction<number>>;
    maxPoints: number;
    setMaxPoints: Dispatch<SetStateAction<number>>;
} | undefined>(undefined);

export const useResultContext = () => {
    const context = useContext(ResultContext);

    if (!context) {
        throw new Error('ResultContext is not provided-');
    }

    return context;
};
import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { SpectrumCard } from '../../../types/SpectrumCard';

export const PrepareContext = createContext<{
    prepareSpectrumCards: SpectrumCard[];
    setPrepareSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
    spectrumCardMaxCount: number;
    setSpectrumCardMaxCount: Dispatch<SetStateAction<number>>;
    startPrepare: (aPrepareSpectrumCards: SpectrumCard[], aPrepareSpectrumCount: number) => void;

} | undefined>(undefined);

export const usePrepareContext = () => {
    const context = useContext(PrepareContext);

    if (!context) {
        throw new Error('PrepareContext is not provided-');
    }

    return context;
};
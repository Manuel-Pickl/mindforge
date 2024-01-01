import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { SpectrumCard } from '../../../types/class/SpectrumCard';
import { PrepareState } from '../../../types/enums/PrepareState';

export const PrepareContext = createContext<{
    prepareSpectrumCards: SpectrumCard[];
    setPrepareSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
    spectrumCardMaxCount: number;
    setSpectrumCardMaxCount: Dispatch<SetStateAction<number>>;
    startPrepare: (aPrepareSpectrumCards: SpectrumCard[], aPrepareSpectrumCount: number) => void;
    prepareState: PrepareState;
    setPrepareState: Dispatch<SetStateAction<PrepareState>>;
    remainingPrepareTime: number;
    setRemainingPrepareTime: Dispatch<SetStateAction<number>>;

} | undefined>(undefined);

export const usePrepareContext = () => {
    const context = useContext(PrepareContext);

    if (!context) {
        throw new Error('PrepareContext is not provided-');
    }

    return context;
};
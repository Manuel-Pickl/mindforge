import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { SpectrumCard } from '../../../types/SpectrumCard';

export const PlayContext = createContext<{
    currentPlayRound : number;
    setCurrentPlayRound: Dispatch<SetStateAction<number>>;
    roundsCount : number;
    setRoundsCount: Dispatch<SetStateAction<number>>;
    playSpectrumCard: SpectrumCard;
    setPlaySpectrumCard: Dispatch<SetStateAction<SpectrumCard>>;
    dial: number;
    setDial: Dispatch<SetStateAction<number>>;
    solutionVisible: boolean;
    setSolutionVisible: Dispatch<SetStateAction<boolean>>;
    showSolution: () => void;
} | undefined>(undefined);

export const usePlayContext = () => {
    const context = useContext(PlayContext);

    if (!context) {
        throw new Error('PlayContext is not provided-');
    }

    return context;
};
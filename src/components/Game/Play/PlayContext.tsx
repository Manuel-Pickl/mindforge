import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { SpectrumCard } from '../../../types/class/SpectrumCard';
import { SwipeModalRef } from '../../SwipeModal1/SwipeModal1';

export const PlayContext = createContext<{
    currentPlayRound : number;
    setCurrentPlayRound: Dispatch<SetStateAction<number>>;
    roundsCount : number;
    setRoundsCount: Dispatch<SetStateAction<number>>;
    playSpectrumCard: SpectrumCard | null;
    setPlaySpectrumCard: Dispatch<SetStateAction<SpectrumCard | null>>;
    dial: number;
    setDial: Dispatch<SetStateAction<number>>;
    solutionVisible: boolean;
    setSolutionVisible: Dispatch<SetStateAction<boolean>>;
    startPlayRound: (aPlaySpectrumCard: SpectrumCard, aCurrentRound: number, aRoundsCount: number) => void;
    showSolution: () => void;
    readyButtonDisabled: boolean;
    setReadyButtonDisabled: Dispatch<SetStateAction<boolean>>;
    splashscreenVisible: boolean;
    setSplashscreenVisible: Dispatch<SetStateAction<boolean>>;
    swipeModalRef: React.RefObject<SwipeModalRef>;    
} | undefined>(undefined);

export const usePlayContext = () => {
    const context = useContext(PlayContext);

    if (!context) {
        throw new Error('PlayContext is not provided-');
    }

    return context;
};
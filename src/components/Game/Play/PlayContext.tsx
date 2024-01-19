import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { SpectrumCard } from '../../../types/class/SpectrumCard';
import { UserTouch } from '../../../types/class/UserTouch';

export const PlayContext = createContext<{
    currentPlayRound : number;
    setCurrentPlayRound: Dispatch<SetStateAction<number>>;
    roundsCount : number;
    setRoundsCount: Dispatch<SetStateAction<number>>;
    playSpectrumCard: SpectrumCard | null;
    setPlaySpectrumCard: Dispatch<SetStateAction<SpectrumCard | null>>;
    dial: number;
    setDial: Dispatch<SetStateAction<number>>;
    updateUserPosition: (aUsername: string, x: number, y: number) => void;
    userTouches: UserTouch[];
    solutionVisible: boolean;
    setSolutionVisible: Dispatch<SetStateAction<boolean>>;
    startPlayRound: (aPlaySpectrumCard: SpectrumCard, aCurrentRound: number, aRoundsCount: number) => void;
    showSolution: () => void;
    readyButtonDisabled: boolean;
    setReadyButtonDisabled: Dispatch<SetStateAction<boolean>>;
    splashscreenVisible: boolean;
    setSplashscreenVisible: Dispatch<SetStateAction<boolean>>;
} | undefined>(undefined);

export const usePlayContext = () => {
    const context = useContext(PlayContext);

    if (!context) {
        throw new Error('PlayContext is not provided-');
    }

    return context;
};
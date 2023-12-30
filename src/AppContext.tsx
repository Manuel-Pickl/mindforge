import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { SpectrumCard } from './types/SpectrumCard';
import { Player } from './types/Player';
import { Page } from './types/Page';

export const AppContext = createContext<{
    page: Page;
    setPage: Dispatch<SetStateAction<Page>>;
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
    room: string;
    setRoom: Dispatch<SetStateAction<string>>;
    isHost: boolean;
    setIsHost: Dispatch<SetStateAction<boolean>>;
    spectrumCards: SpectrumCard[];
    setSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
} | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('AppContext is not provided-');
    }

    return context;
};
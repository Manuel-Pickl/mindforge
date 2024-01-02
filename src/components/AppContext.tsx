import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { SpectrumCard } from '../types/class/SpectrumCard';
import { Player } from '../types/class/Player';
import { Page } from '../types/enums/Page';

export const AppContext = createContext<{
    page: Page;
    setPage: Dispatch<SetStateAction<Page>>;
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
    room: string;
    setRoom: Dispatch<SetStateAction<string>>;
    spectrumCards: SpectrumCard[];
    setSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
    getPlayer: () => Player;
    getMates: () => Player[];
} | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('AppContext is not provided-');
    }

    return context;
};
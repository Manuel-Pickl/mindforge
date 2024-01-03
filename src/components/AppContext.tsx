import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { Page } from '../types/enums/Page';
import { Player } from '../types/class/Player';

export const AppContext = createContext<{
    page: Page;
    setPage: Dispatch<SetStateAction<Page>>;
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
    room: string;
    setRoom: Dispatch<SetStateAction<string>>;
    players: Player[];
    setPlayers: Dispatch<SetStateAction<Player[]>>;
    getPlayer: (aUsername?: string | null) => Player | undefined;
    getMates: () => Player[];
} | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('AppContext is not provided-');
    }

    return context;
};
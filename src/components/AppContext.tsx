import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { Player } from '../types/class/Player';

export const AppContext = createContext<{
    offline: boolean;
    setOffline: Dispatch<SetStateAction<boolean>>;
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
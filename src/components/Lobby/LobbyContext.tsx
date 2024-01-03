import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { Player } from '../../types/class/Player';

export const LobbyContext = createContext<{
    lobbyPlayers: Player[];
    setLobbyPlayers: Dispatch<SetStateAction<Player[]>>;
} | undefined>(undefined);

export const useLobbyContext = () => {
    const context = useContext(LobbyContext);

    if (!context) {
        throw new Error('LobbyContext is not provided-');
    }

    return context;
};
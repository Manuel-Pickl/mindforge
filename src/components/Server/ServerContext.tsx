import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Player } from "../../types/class/Player";
import { SpectrumCard } from "../../types/class/SpectrumCard";

export const ServerContext = createContext<{
    setServerPlayers: Dispatch<SetStateAction<Player[]>>;
    setServerSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
    setServerCurrentPlayRound: Dispatch<SetStateAction<number>>;
    setServerRemainingPrepareTime: Dispatch<SetStateAction<number>>;
    setServerRemainingPrepareTimeInterval: Dispatch<SetStateAction<NodeJS.Timeout | undefined>>;
} | undefined>(undefined);


export const useServerContext = () => {
    const context = useContext(ServerContext);

    if (!context) {
        throw new Error('ServerContext is not provided-');
    }

    return context;
};
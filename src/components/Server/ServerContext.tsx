import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Player } from "../../types/class/Player";
import { SpectrumCard } from "../../types/class/SpectrumCard";

export const ServerContext = createContext<{
    setPlayers: Dispatch<SetStateAction<Player[]>>;
    setSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
    setCurrentPlayRound: Dispatch<SetStateAction<number>>;
    setRemainingPrepareTime: Dispatch<SetStateAction<number>>;
    setRemainingPrepareTimeInterval: Dispatch<SetStateAction<NodeJS.Timeout | undefined>>;
} | undefined>(undefined);


export const useServerContext = () => {
    const context = useContext(ServerContext);

    if (!context) {
        throw new Error('ServerContext is not provided-');
    }

    return context;
};
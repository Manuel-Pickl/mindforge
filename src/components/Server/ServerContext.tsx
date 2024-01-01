import { Dispatch, SetStateAction, createContext, useContext } from "react";

export const ServerContext = createContext<{
    remainingPrepareTime: number;
    setRemainingPrepareTime: Dispatch<SetStateAction<number>>;
} | undefined>(undefined);


export const useServerContext = () => {
    const context = useContext(ServerContext);

    if (!context) {
        throw new Error('ServerContext is not provided-');
    }

    return context;
};
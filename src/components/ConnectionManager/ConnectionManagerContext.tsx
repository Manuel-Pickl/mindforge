import { Dispatch, MutableRefObject, SetStateAction, createContext, useContext } from 'react';
import { Page } from '../../types/Page';
import { Player } from '../../types/Player';
import { SpectrumCard } from '../../types/SpectrumCard';

export const ConnectionManagerContext = createContext<{
    mqttHelperRef: MutableRefObject<any>;
    setPage: Dispatch<SetStateAction<Page>>;
    setUsername: Dispatch<SetStateAction<string>>;
    setPlayers: Dispatch<SetStateAction<Set<Player>>>;
    setIsHost: Dispatch<SetStateAction<boolean>>;
    setSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
    createRoom: () => void;
    startPrepare: () => void;
    joinRoom: (_roomId: string) => void;
    updateGlobalDial: (aValue: number) => void;
    sendPrepareFinished: (aPrepareSpectrumCards: SpectrumCard[]) => void;
    sendPlayRoundFinished: (aValue: boolean) => void;
} | undefined>(undefined);

export const useConnectionManagerContext = () => {
    const context = useContext(ConnectionManagerContext);

    if (!context) {
        throw new Error('ConnectionManagerContext is not provided.');
    }

    return context;
};
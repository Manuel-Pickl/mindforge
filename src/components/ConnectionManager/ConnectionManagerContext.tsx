import { Dispatch, MutableRefObject, SetStateAction, createContext, useContext } from 'react';
import { SpectrumCard } from '../../types/class/SpectrumCard';

export const ConnectionManagerContext = createContext<{
    setJoined: Dispatch<SetStateAction<boolean>>;
    mqttHelperRef: MutableRefObject<any>;
    createRoom_host: (roomId?: string | null) => void;
    startPrepare: () => void;
    joinRoom: (aRoom: string, aIsHost?: boolean) => void;
    updateGlobalDial: (aValue: number, aUsername?: string, x?: number, y?: number) => void;
    sendPreparedCard: (aPrepareSpectrumCards: SpectrumCard) => void;
    sendPlayRoundFinished: (aValue: boolean) => void;
    sendChangeAvatar: (aIndexDelta: number) => void;
    startPlay_host: () => void;
    startPlayRound_host: (aSpectrumCards: SpectrumCard[]) => void;
    restart_host: () => void;
    restartToLobby: (aAction: string) => void;
} | undefined>(undefined);

export const useConnectionManagerContext = () => {
    const context = useContext(ConnectionManagerContext);

    if (!context) {
        throw new Error('ConnectionManagerContext is not provided.');
    }

    return context;
};
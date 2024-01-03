import { Dispatch, MutableRefObject, SetStateAction, createContext, useContext } from 'react';
import { SpectrumCard } from '../../types/class/SpectrumCard';

export const ConnectionManagerContext = createContext<{
    setJoined: Dispatch<SetStateAction<boolean>>;
    mqttHelperRef: MutableRefObject<any>;
    createRoom: () => void;
    startPrepare: () => void;
    joinRoom: (aIsHost: boolean) => void;
    updateGlobalDial: (aValue: number) => void;
    sendPreparedCard: (aPrepareSpectrumCards: SpectrumCard) => void;
    sendPlayRoundFinished: (aValue: boolean) => void;
    sendChangeAvatar: (aIndexDelta: number) => void;
    startPlay_host: () => void;
    startPlayRound_host: (aSpectrumCards: SpectrumCard[]) => void;
} | undefined>(undefined);

export const useConnectionManagerContext = () => {
    const context = useContext(ConnectionManagerContext);

    if (!context) {
        throw new Error('ConnectionManagerContext is not provided.');
    }

    return context;
};
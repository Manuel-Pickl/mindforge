import { MutableRefObject, createContext, useContext } from 'react';
import { SpectrumCard } from '../../types/SpectrumCard';

export const ConnectionManagerContext = createContext<{
    mqttHelperRef: MutableRefObject<any>;
    createRoom: () => void;
    startPrepare: () => void;
    joinRoom: (_roomId: string) => void;
    updateGlobalDial: (aValue: number) => void;
    sendPrepareFinished: (aPrepareSpectrumCards: SpectrumCard[]) => void;
    sendPlayRoundFinished: (aValue: boolean) => void;
    sendChangeAvatar: (aIndexDelta: number) => void;
} | undefined>(undefined);

export const useConnectionManagerContext = () => {
    const context = useContext(ConnectionManagerContext);

    if (!context) {
        throw new Error('ConnectionManagerContext is not provided.');
    }

    return context;
};
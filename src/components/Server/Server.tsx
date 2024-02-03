import { ReactNode, useState } from "react";
import { prepareTime } from "../../Settings";
import { ServerContext } from "./ServerContext";
import { Player } from "../../types/class/Player";
import { SpectrumCard } from "../../types/class/SpectrumCard";

export const ServerProvider: React.FC<{ children: ReactNode }> = ({ children }) =>
{
    const [_players, setServerPlayers] = useState<Player[]>([]);
    const [_spectrumCards, setServerSpectrumCards] = useState<SpectrumCard[]>([]);
    const [_currentPlayRound, setServerCurrentPlayRound] = useState<number>(0);
    const [_remainingPrepareTime, setServerRemainingPrepareTime] = useState<number>(prepareTime);
    const [_remainingPrepareTimeInterval, setServerRemainingPrepareTimeInterval] = useState<NodeJS.Timeout>();

    return (<ServerContext.Provider value={{ setServerPlayers, setServerSpectrumCards, setServerCurrentPlayRound, setServerRemainingPrepareTime, setServerRemainingPrepareTimeInterval }}>{children}</ServerContext.Provider>);
};

function Server() {
}

export default Server;
import { ReactNode, useState } from "react";
import { prepareTime } from "../../Settings";
import { ServerContext } from "./ServerContext";
import { Player } from "../../types/class/Player";
import { SpectrumCard } from "../../types/class/SpectrumCard";

export const ServerProvider: React.FC<{ children: ReactNode }> = ({ children }) =>
{
    const [_players, setPlayers] = useState<Player[]>([]);
    const [_spectrumCards, setSpectrumCards] = useState<SpectrumCard[]>([]);
    const [_currentPlayRound, setCurrentPlayRound] = useState<number>(0);
    const [_remainingPrepareTime, setRemainingPrepareTime] = useState<number>(prepareTime);
    const [_remainingPrepareTimeInterval, setRemainingPrepareTimeInterval] = useState<NodeJS.Timeout>();

    return (<ServerContext.Provider value={{ setPlayers, setSpectrumCards, setCurrentPlayRound, setRemainingPrepareTime, setRemainingPrepareTimeInterval }}>{children}</ServerContext.Provider>);
};

function Server() {
}

export default Server;
import { ReactNode, useState } from "react";
import { ResultContext, useResultContext } from "./ResultContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import { useAppContext } from "../../../AppContext";

export const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [points, setPoints] = useState<number>(0);
    const [maxPoints, setMaxPoints] = useState<number>(0);
  
    return (<ResultContext.Provider value={{ points, setPoints, maxPoints, setMaxPoints }}>{children}</ResultContext.Provider>);
};

function Result ()
{
    const {
        points,
        maxPoints,
    } = useResultContext();

    const {
        getPlayer,
    } = useAppContext();

    const {
        startPrepare,
    } = useConnectionManagerContext();

    return (
        <div>
            points: {points} / {maxPoints}
            
            <br/>
            
            {getPlayer()?.isHost &&
                <button
                    onClick={startPrepare}
                >
                    Nochmal spielen
                </button>
            }

            <button>Zur Lobby</button>
        </div>
    );
}

export default Result;
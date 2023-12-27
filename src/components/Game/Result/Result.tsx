import { ReactNode, useState } from "react";
import { ResultContext, useResultContext } from "./ResultContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import { useAppContext } from "../../../AppContext";

export const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [result, setResult] = useState<number>(0);
  
    return (<ResultContext.Provider value={{ result, setResult }}>{children}</ResultContext.Provider>);
};

function Result ()
{
    const {
        result,
    } = useResultContext();

    const {
        isHost,
    } = useAppContext();

    const {
        startPrepare,
    } = useConnectionManagerContext();

    return (
        <div>
            points: {result}
            
            <br/>
            
            {isHost &&
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
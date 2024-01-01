import { ReactNode, useState } from "react";
import { prepareTime } from "../../Settings";
import { ServerContext } from "./ServerContext";

export const ServerProvider: React.FC<{ children: ReactNode }> = ({ children }) =>
{
    const [remainingPrepareTime, setRemainingPrepareTime] = useState<number>(prepareTime);
    
    return (<ServerContext.Provider value={{ remainingPrepareTime, setRemainingPrepareTime }}>{children}</ServerContext.Provider>);
};

function Server() {
}

export default Server;
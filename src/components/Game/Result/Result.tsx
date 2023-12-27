import { ReactNode, useState } from "react";
import { ResultContext, useResultContext } from "./ResultContext";

export const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [result, setResult] = useState<number>(0);
  
    return (<ResultContext.Provider value={{ result, setResult }}>{children}</ResultContext.Provider>);
};

function Result ()
{
    const {
        result
    } = useResultContext();

    return (
        <div>
            points: {result}
        </div>
    );
}

export default Result;
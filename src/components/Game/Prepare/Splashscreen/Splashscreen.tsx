import { useEffect, useState } from "react";
import { prepareSplashscreenDuration } from "../../../../services/Settings";
import "./Splashscreen.scss";
import Counter from "../Counter/Counter";

interface SplashscreenProps {
    totalTime: number;
    spectrumCardMaxCount: number;
}
  
function Splashscreen({
    totalTime,
    spectrumCardMaxCount }: SplashscreenProps)
{
    const counterStart: number = prepareSplashscreenDuration / 1000;
    const [counter, setCounter] = useState<number>(counterStart);
    
    useEffect(() => {
        const counterInterval = setInterval(() => {
            setCounter(aCounter => aCounter - 1);
        }, 1000);

        return () => {
            clearInterval(counterInterval);
        };
    }, []);

    return (
    <div className="splashscreenComponent">
        <div className="info">
            Du hast {totalTime/60} Minuten um {spectrumCardMaxCount} Hinweise zu schreiben
        </div>

        <div className="counterWrapper">
            <Counter
                startTime={counterStart}
                remainingTime={counter}
            />
        </div>
        
        <div className="soon">
            Das Spiel beginnt gleich...
        </div>
    </div>
    );
}

export default Splashscreen;
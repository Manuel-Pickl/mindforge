import { useEffect, useState } from "react";
import { prepareSplashscreenDuration, prepareTime } from "../../../../Settings";
import "./Splashscreen.scss";
import Counter from "../../../Counter/Counter";
import Card from "../../../Card/Card";

interface SplashscreenProps {
    spectrumCardMaxCount: number;
}
  
function Splashscreen({
    spectrumCardMaxCount }: SplashscreenProps)
{
    const counterStart: number = prepareSplashscreenDuration;
    const [counter, setCounter] = useState<number>(counterStart);
    
    useEffect(() => {
        const splashscreenInterval = setInterval(() => {
            setCounter(aCounter => aCounter - 1);
        }, 1000);

        return () => {
            clearInterval(splashscreenInterval);
        };
    }, []);

    function prepareTimeInMinutes(): string {
        return Math.round(prepareTime / 60).toString();
    }

    return (
    <div className="splashscreenComponent">
        <Card>
            Du hast {prepareTimeInMinutes()} Minuten um {spectrumCardMaxCount} {spectrumCardMaxCount > 1 ? "Hinweise" : "Hinweis"} zu schreiben
        </Card>
        
        <div className="counterWrapper">
            <Counter
                startTime={counterStart}
                remainingTime={counter}
            />
        </div>
        
        <div className="outline">
            Das Spiel beginnt gleich...
        </div>
    </div>
    );
}

export default Splashscreen;
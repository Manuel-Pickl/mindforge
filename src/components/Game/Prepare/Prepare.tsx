import { ReactNode, useEffect, useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";
import { PrepareContext, usePrepareContext } from "./PrepareContext";
import { prepareSplashscreenDuration } from "../../../services/Settings";
import { PrepareState } from "../../../types/PrepareState";
import Finishscreen from "./Finishscreen/Finishscreen";
import Splashscreen from "./Splashscreen/Splashscreen";
import Clue from "./Clue/Clue";

export const PrepareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [prepareSpectrumCards, setPrepareSpectrumCards] = useState<SpectrumCard[]>([]);
    const [spectrumCardMaxCount, setSpectrumCardMaxCount] = useState<number>(0);
    const [prepareState, setPrepareState] = useState<PrepareState>(PrepareState.Splashscreen);

    function startPrepare(aPrepareSpectrumCards: SpectrumCard[], aPrepareSpectrumCount: number) {
        setPrepareSpectrumCards(aPrepareSpectrumCards);
        setSpectrumCardMaxCount(aPrepareSpectrumCount);
        
        setTimeout(() => {
            setPrepareState(PrepareState.Prepare)
        }, prepareSplashscreenDuration);
    }

    return (<PrepareContext.Provider value={{ prepareSpectrumCards, setPrepareSpectrumCards, spectrumCardMaxCount, setSpectrumCardMaxCount, startPrepare, prepareState, setPrepareState }}>{children}</PrepareContext.Provider>);
};

function Prepare ()
{
    const startTime: number = 300; // get calc and sent
    const [remainingTime, setRemainingTime] = useState<number>(startTime);
    
    const {
        prepareState,
        prepareSpectrumCards,
        spectrumCardMaxCount,
    } = usePrepareContext();

    useEffect(() => {
        setTimeout(() => {
            const remainingTimeInterval = setInterval(() => {
                setRemainingTime(aRemainingTime => aRemainingTime - 1);
            }, 1000);
    
            return () => {
                clearInterval(remainingTimeInterval);
            };    
        }, prepareSplashscreenDuration);
    }, []);

    if (prepareSpectrumCards.length == 0) {
        return;
    }

    return (
        <>
            {prepareState == PrepareState.Splashscreen &&
            <>
                <Splashscreen
                    totalTime={startTime}
                    spectrumCardMaxCount={spectrumCardMaxCount}
                />
            </>
            }

            {prepareState == PrepareState.Prepare &&
            <>
                <Clue />    
            </>
            }
            
            {prepareState == PrepareState.Finished &&
            <>
                <Finishscreen
                    startTime={startTime}
                    remainingTime={remainingTime}
                />
            </>
            }
        </>
    );
}

export default Prepare;
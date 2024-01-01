import { ReactNode, useState } from "react";
import { SpectrumCard } from "../../../types/class/SpectrumCard";
import { PrepareContext, usePrepareContext } from "./PrepareContext";
import { prepareSplashscreenDuration, prepareTime } from "../../../Settings";
import { PrepareState } from "../../../types/enums/PrepareState";
import Finishscreen from "./Finishscreen/Finishscreen";
import Splashscreen from "./Splashscreen/Splashscreen";
import Clue from "./Clue/Clue";

export const PrepareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [prepareSpectrumCards, setPrepareSpectrumCards] = useState<SpectrumCard[]>([]);
    const [spectrumCardMaxCount, setSpectrumCardMaxCount] = useState<number>(0);
    const [prepareState, setPrepareState] = useState<PrepareState>(PrepareState.Splashscreen);
    const [remainingPrepareTime, setRemainingPrepareTime] = useState<number>(prepareTime);

    function startPrepare(aPrepareSpectrumCards: SpectrumCard[], aPrepareSpectrumCount: number) {
        setPrepareSpectrumCards(aPrepareSpectrumCards);
        setSpectrumCardMaxCount(aPrepareSpectrumCount);
        
        setTimeout(() => {
            setPrepareState(PrepareState.Prepare)
        }, prepareSplashscreenDuration * 1000);
    }

    return (<PrepareContext.Provider value={{ prepareSpectrumCards, setPrepareSpectrumCards, spectrumCardMaxCount, setSpectrumCardMaxCount, startPrepare, prepareState, setPrepareState, remainingPrepareTime, setRemainingPrepareTime }}>{children}</PrepareContext.Provider>);
};

function Prepare ()
{
    const {
        prepareState,
        prepareSpectrumCards,
        spectrumCardMaxCount,
    } = usePrepareContext();

    if (prepareSpectrumCards.length == 0) {
        return;
    }

    return (
        <>
            {prepareState == PrepareState.Splashscreen &&
            <>
                <Splashscreen
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
                <Finishscreen />
            </>
            }
        </>
    );
}

export default Prepare;
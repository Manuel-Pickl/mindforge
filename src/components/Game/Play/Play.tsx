import { ReactNode, useEffect, useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";
import { solutionDuration, splashscreenDuration } from "../../../services/Settings";
import { PlayContext, usePlayContext } from "./PlayContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import Dial from "../../Dial/Dial";

export const PlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentPlayRound, setCurrentPlayRound] = useState<number>(0);
    const [roundsCount, setRoundsCount] = useState<number>(-1);
    const [playSpectrumCard, setPlaySpectrumCard] = useState<SpectrumCard | null>(null);
    const [dial, setDial] = useState<number>(50);
    const [solutionVisible, setSolutionVisible] = useState<boolean>(false);
    
    function showSolution() {
        setSolutionVisible(true);
        setTimeout(() => {setSolutionVisible(false)}, solutionDuration);
    }

    return (<PlayContext.Provider value={{ currentPlayRound, setCurrentPlayRound, roundsCount, setRoundsCount, playSpectrumCard, setPlaySpectrumCard, dial, setDial, solutionVisible, setSolutionVisible, showSolution }}>{children}</PlayContext.Provider>);
};

function Play()
{
    const [readyButtonDisabled, setReadyButtonDisabled] = useState<boolean>(false);
    const [splashscreenVisible, setSplashscreenVisible] = useState<boolean>(true)

    const {
        currentPlayRound,
        roundsCount,
        playSpectrumCard, solutionVisible,
        dial, setDial,
    } = usePlayContext();
    
    const {
        sendPlayRoundFinished,
        updateGlobalDial,
    } = useConnectionManagerContext();

    useEffect(() => {
        setReadyButtonDisabled(false);
        
        setSplashscreenVisible(true);
        setTimeout(() => { setSplashscreenVisible(false) }, splashscreenDuration);
    }, [playSpectrumCard]);

    useEffect(() => {
        setReadyButtonDisabled(false);
        sendPlayRoundFinished(false);
    }, [dial]);

    function onDialChange(aValue: number) {
        if (solutionVisible) {
            return;
        }

        setDial(aValue);
        updateGlobalDial(aValue);
    }

    function onFinishedClick() {
        setReadyButtonDisabled(true);
        sendPlayRoundFinished(true);
    }

    return (
        <div>
            {splashscreenVisible ? (
            <div>
                <h1>Hinweis von {playSpectrumCard?.owner} {"("}{currentPlayRound}/{roundsCount}{")"}</h1>
            </div>
            ) : (
            <div>
                <h1>Spektrum Karten abschätzen</h1>
                <h2>Spektrum Karte von {playSpectrumCard?.owner}</h2>
                <h2>Hinweis: {playSpectrumCard?.clue}</h2>
                
                <Dial
                    hideHand={false}
                    showSolution={solutionVisible}
                    solution={playSpectrumCard?.realDial ?? 0}
                    onDialChange={onDialChange}
                    dial={dial}
                    scale={playSpectrumCard?.scale ?? ["",""]}
                />
            
                <br/><br/><br/><br/>

                <button
                    disabled={readyButtonDisabled}
                    onClick={onFinishedClick}
                >
                    Fertig
                </button>
            </div>
            )}
        </div>
    );
}

export default Play;
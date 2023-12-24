import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";
import { solutionDuration, splashscreenDuration } from "../../../services/Settings";

interface PlayProps
{
    sendPlayRoundFinished: (aValue: boolean) => void;
    dial: number;
    setDial: Dispatch<SetStateAction<number>>;
    playSpectrumCard: SpectrumCard | null;
    updateGlobalDial: (aValue: number) => void;
    currentPlayRound: number;
    roundsCount: number;
    roundSolutionIsShown: boolean;
    setRoundSolutionIsShown: Dispatch<SetStateAction<boolean>>;
}

function Play ({
    sendPlayRoundFinished,
    dial,
    setDial,
    playSpectrumCard,
    updateGlobalDial,
    currentPlayRound,
    roundsCount,
    roundSolutionIsShown,
    setRoundSolutionIsShown}: PlayProps)
{
    const [readyButtonDisabled, setReadyButtonDisabled] = useState<boolean>(false);
    const [splashscreenVisible, setSplashscreenVisible] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => {setRoundSolutionIsShown(false)}, solutionDuration);
    }, [roundSolutionIsShown]);

    useEffect(() => {
        setReadyButtonDisabled(false);
        
        setSplashscreenVisible(true);
        setTimeout(() => { setSplashscreenVisible(false) }, splashscreenDuration);
    }, [playSpectrumCard]);

    useEffect(() => {
        setReadyButtonDisabled(false);
        sendPlayRoundFinished(false);
    }, [dial]);

    function onDialChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (roundSolutionIsShown) {
            return;
        }

        const newDial = parseFloat(event.target.value);

        setDial(newDial);
        updateGlobalDial(newDial);
    }

    function onFinishedClick() {
        setReadyButtonDisabled(true);
        sendPlayRoundFinished(true);
    }

    // function showSolution() {
    // }

    // Expose methods through ref forwarding
    // useImperativeHandle(ref, () => ({
    //     showSolution,
    // }));

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
                
                {roundSolutionIsShown &&
                <div>
                    <span style={{ color: 'white' }}>
                        {playSpectrumCard?.scale[0]}
                    </span>
                    <input readOnly
                        type="range"
                        min={0}
                        max={100}
                        step={10}
                        value={playSpectrumCard?.realDial}
                    />            
                </div>
                }
    
                <br/>
    
                {playSpectrumCard?.scale[0]}
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={10}
                    value={dial}
                    onChange={onDialChange}
                />
                {playSpectrumCard?.scale[1]}
            
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
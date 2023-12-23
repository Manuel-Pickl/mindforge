import { useEffect, useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";

interface PlayProps
{
    sendPlayRoundFinished: (aValue: boolean) => void;
    dial: number;
    setDial: React.Dispatch<React.SetStateAction<number>>;
    playSpectrumCard: SpectrumCard | null;
    updateGlobalDial: (aValue: number) => void;
    currentPlayRound: number;
    roundsCount: number;
}

function Play ({
    sendPlayRoundFinished,
    dial,
    setDial,
    playSpectrumCard,
    updateGlobalDial,
    currentPlayRound,
    roundsCount}: PlayProps)
{
    const [solutionIsShown, setSolutionIsShown] = useState<boolean>(false);
    const [readyButtonDisabled, setReadyButtonDisabled] = useState<boolean>(false);
    const [splashscreenVisible, setSplashscreenVisible] = useState<boolean>(true)

    useEffect(() => {
        setReadyButtonDisabled(false);
        setSplashscreenVisible(true);

        setTimeout(() => {
            setSplashscreenVisible(false);
        }, 3000);
    }, [playSpectrumCard]);

    useEffect(() => {
        setReadyButtonDisabled(false);
        sendPlayRoundFinished(false);
    }, [dial]);

    function onDialChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newDial = parseFloat(event.target.value);

        setDial(newDial);
        updateGlobalDial(newDial);
    }

    function onFinishedClick() {
        sendPlayRoundFinished(true);
        setReadyButtonDisabled(true);
    }

    function showSolution() {
        
    }

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
                
                {solutionIsShown ??
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
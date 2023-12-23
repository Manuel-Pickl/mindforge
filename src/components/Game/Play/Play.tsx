import { useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";

interface PlayProps
{
    sendPlayRoundFinished: () => void;
    dial: number;
    setDial: React.Dispatch<React.SetStateAction<number>>;
    playSpectrumCard: SpectrumCard | null;
    updateGlobalDial: (aValue: number) => void;
}

function Play ({
    sendPlayRoundFinished,
    dial,
    setDial,
    playSpectrumCard,
    updateGlobalDial }: PlayProps)
{
    const [solutionIsShown, setSolutionIsShown] = useState<boolean>(false);
    const [playRoundFinished, setPlayRoundFinished] = useState<boolean>(false);

    function onDialChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newDial = parseFloat(event.target.value);
        setDial(newDial);
        updateGlobalDial(newDial);
    }

    function onFinishedClick() {
        sendPlayRoundFinished();
        setPlayRoundFinished(true);
    }

    return (
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
                disabled={playRoundFinished}
                onClick={onFinishedClick}
            >
                Fertig
            </button>
        </div>
    );
}

export default Play;
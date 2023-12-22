import { useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";

interface PrepareProps
{
    sendPrepareFinished: () => void;
    spectrumCards: SpectrumCard[];
    setSpectrumCards: (aValue: SpectrumCard[]) => void;
}

function Prepare ({
    sendPrepareFinished,
    spectrumCards,
    setSpectrumCards }: PrepareProps)
{
    const [clue, setClue] = useState<string>("");
    const [prepareFinished, setPrepareFinished] = useState<boolean>(false);

    const [currentSpectrumCardIndex, setCurrentSpectrumCardIndex] = useState<number>(0);
    
    function showNextSpectrumCard() {
        const finishedAllSpectrumCards: boolean = currentSpectrumCardIndex >= spectrumCards.length - 1;
        
        if (!finishedAllSpectrumCards) {
            spectrumCards[currentSpectrumCardIndex].clue = clue;
            setSpectrumCards([...spectrumCards]);
            
            setCurrentSpectrumCardIndex(currentSpectrumCardIndex + 1);
            setClue("");
        }
        else {
            setPrepareFinished(true);
            sendPrepareFinished();
        }

    }

    return (
        <div>
            <h1>Spektrum Karten abschätzen</h1>
            {!prepareFinished ? (
            <div>
                <h2>{currentSpectrumCardIndex + 1}. Spektrum Karte</h2>
                <input readOnly
                    type="range"
                    min={0}
                    max={100}
                    step={10}
                    value={spectrumCards[currentSpectrumCardIndex].dial}
                    />
                <br/>
                {spectrumCards[currentSpectrumCardIndex].scale[0]} {spectrumCards[currentSpectrumCardIndex].scale[1]}
                <br/>
                <input
                    type="text"
                    value={clue}
                    onChange={(event) => setClue(event.target.value)}
                />
                <br/>
                <button disabled={clue.trim().length == 0}
                    onClick={showNextSpectrumCard}
                >
                    Next
                </button>
            </div>
            ) : (
            <div>
                waiting for other players
            </div>
            )}
        </div>
    );
}

export default Prepare;
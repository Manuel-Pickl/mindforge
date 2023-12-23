import { useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";

interface PrepareProps
{
    sendPrepareFinished: () => void;
    prepareSpectrumCards: SpectrumCard[];
    setPrepareSpectrumCards: (aValue: SpectrumCard[]) => void;
}

function Prepare ({
    sendPrepareFinished,
    prepareSpectrumCards,
    setPrepareSpectrumCards }: PrepareProps)
{
    const [clue, setClue] = useState<string>("");
    const [prepareFinished, setPrepareFinished] = useState<boolean>(false);
    const [currentSpectrumCardIndex, setCurrentSpectrumCardIndex] = useState<number>(0);
    
    function showNextSpectrumCard() {
        prepareSpectrumCards[currentSpectrumCardIndex].clue = clue;
        setPrepareSpectrumCards([...prepareSpectrumCards]);
        
        const finishedAllSpectrumCards: boolean = currentSpectrumCardIndex >= prepareSpectrumCards.length - 1;
        if (!finishedAllSpectrumCards) {
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
            <h1>Hinweise aufschreiben</h1>
            {!prepareFinished ? (
            <div>
                <h2>{currentSpectrumCardIndex + 1}. Spektrum Karte</h2>

                {prepareSpectrumCards[currentSpectrumCardIndex].scale[0]}
                <input readOnly
                    type="range"
                    min={0}
                    max={100}
                    step={10}
                    value={prepareSpectrumCards[currentSpectrumCardIndex].dial}
                />
                {prepareSpectrumCards[currentSpectrumCardIndex].scale[1]}

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
                warten auf andere Spieler...
            </div>
            )}
        </div>
    );
}

export default Prepare;
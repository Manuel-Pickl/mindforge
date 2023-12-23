import { useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";

interface PlayProps
{
    dial: number;
    setDial: React.Dispatch<React.SetStateAction<number>>;
    playSpectrumCards: SpectrumCard[];
    updateGlobalDial: (aValue: number) => void;
}

function Play ({
    dial,
    setDial,
    playSpectrumCards,
    updateGlobalDial }: PlayProps)
{
    const [currentSpectrumCardIndex, _setCurrentSpectrumCardIndex] = useState<number>(0);

    function onDialChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newDial = parseFloat(event.target.value);
        setDial(newDial);
        updateGlobalDial(newDial);
    }

    return (
        <div>
            <h1>Spektrum Karten abschätzen</h1>
            <h2>{currentSpectrumCardIndex + 1}. Spektrum Karte von {playSpectrumCards[currentSpectrumCardIndex].owner}</h2>
            <h2>Hinweis: {playSpectrumCards[currentSpectrumCardIndex].clue}</h2>
            {/* <span style={{ color: 'white' }}>
                {playSpectrumCards[currentSpectrumCardIndex].scale[0]}
            </span>
            <input readOnly
                type="range"
                min={0}
                max={100}
                step={10}
                value={playSpectrumCards[currentSpectrumCardIndex].dial}
            />            
            <br/> */}

            {playSpectrumCards[currentSpectrumCardIndex].scale[0]}
            <input
                type="range"
                min={0}
                max={100}
                step={10}
                value={dial}
                onChange={onDialChange}
            />
            {playSpectrumCards[currentSpectrumCardIndex].scale[1]}
        

            <button>Bereit</button>
        </div>
    );
}

export default Play;
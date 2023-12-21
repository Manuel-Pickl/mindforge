import { useState } from "react";

interface PrepareProps
{
    playerIsReady: () => void;
}

function Prepare ({ playerIsReady }: PrepareProps)
{
    const [clue, setClue] = useState<string>("");
    const spectrumCard = {
        dial: 50,
        scale: ["cold", "hot"],
    };

    return (
        <div>
            dial: {spectrumCard.dial}<br/>
            scale: {spectrumCard.scale}<br/>
            <input
                type="text"
                value={clue}
                onChange={(event) => setClue(event.target.value)}
            />
            <button
                onClick={playerIsReady}
            >
                Play
            </button>
        </div>
    );
}

export default Prepare;
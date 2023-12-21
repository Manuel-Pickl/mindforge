import { useState } from "react";

interface GameProps
{
    dial: number;
    setDial: React.Dispatch<React.SetStateAction<number>>;
    changeDial: (aValue: number) => void;
}

function Game ({ dial, setDial, changeDial }: GameProps)
{
    const updateCooldown = 0;
    const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

    function onDialChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newDial = parseFloat(event.target.value);
        setDial(newDial);

        updateGlobalDial(newDial);
    }

    function updateGlobalDial(dial: number) {
        const elapsedTimeSinceLastUpdate = Date.now() - lastUpdate;
        if (elapsedTimeSinceLastUpdate < updateCooldown) {
            return;
        } 
        setLastUpdate(Date.now());

        changeDial(dial);
    }

    return (
        <div>
            <input
                type="range"
                min={0}
                max={100}
                step={10}
                value={dial}
                onChange={onDialChange}
            />
        </div>
    );
}

export default Game;
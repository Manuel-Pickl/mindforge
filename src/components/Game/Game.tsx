interface GameProps
{
    dial: number;
    setDial: React.Dispatch<React.SetStateAction<number>>;
    changeDial: (aValue: number) => void;
}

function Game ({ dial, setDial, changeDial }: GameProps)
{
    function onDialChange(event) {
        const newDial = parseFloat(event.target.value);
        setDial(newDial);
        changeDial(newDial);
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
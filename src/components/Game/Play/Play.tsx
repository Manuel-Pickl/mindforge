interface PlayProps
{
    dial: number;
    setDial: React.Dispatch<React.SetStateAction<number>>;
    updateGlobalDial: (aValue: number) => void;
}

function Play ({ dial, setDial, updateGlobalDial }: PlayProps)
{
    function onDialChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newDial = parseFloat(event.target.value);
        setDial(newDial);
        updateGlobalDial(newDial);
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

export default Play;
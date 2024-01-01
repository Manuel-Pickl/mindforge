import {  useEffect, useState } from "react";
import { usePrepareContext } from "../PrepareContext";
import { useConnectionManagerContext } from "../../../ConnectionManager/ConnectionManagerContext";
import { clueMaxLength, skipsPerCard } from "../../../../Settings";
import Dial from "../../../Dial/Dial";
import "./Clue.scss";
import { PrepareState } from "../../../../types/enums/PrepareState";
import Counter from "../Counter/Counter";

function Clue ()
{
    const startTime: number = 300; // get calc and sent
    
    const [remainingTime, setRemainingTime] = useState<number>(startTime);
    
    const [clue, setClue] = useState<string>("");
    const [currentSpectrumCardIndex, setCurrentSpectrumCardIndex] = useState<number>(0);
    const [spectrumCardCount, setSpectrumCardCount] = useState<number>(1);
    const [currentSkipsCount, setCurrentSkipsCount] = useState<number>(0);
    const [skipDisabled, setSkipDisabled] = useState<boolean>(false);
    
    const {
        setPrepareState,
        prepareSpectrumCards, setPrepareSpectrumCards,
        spectrumCardMaxCount,
    } = usePrepareContext();

    const {
        sendPrepareFinished
    } = useConnectionManagerContext();

    useEffect(() => {
        const remainingTimeInterval = setInterval(() => {
            setRemainingTime(aRemainingTime => aRemainingTime - 1);
        }, 1000);

        return () => {
            clearInterval(remainingTimeInterval);
        };    
    }, []);

    function skipSpectrumCard() {
        const newSkipCount = currentSkipsCount + 1;
        const skipDisabled = newSkipCount >= skipsPerCard;
        setCurrentSkipsCount(newSkipCount);
        setSkipDisabled(skipDisabled);

        setClue("");
        setCurrentSpectrumCardIndex(currentSpectrumCardIndex + 1);
    }

    function showNextSpectrumCard() {
        prepareSpectrumCards[currentSpectrumCardIndex].clue = clue;
        prepareSpectrumCards[currentSpectrumCardIndex].skipped = false;
        setPrepareSpectrumCards([...prepareSpectrumCards]);

        const finishedAllSpectrumCards: boolean = spectrumCardCount >= spectrumCardMaxCount;
        if (!finishedAllSpectrumCards) {            
            setCurrentSpectrumCardIndex(currentSpectrumCardIndex + 1);
            setSpectrumCardCount(spectrumCardCount + 1);
            setClue("");
            setCurrentSkipsCount(0);
            setSkipDisabled(false);
        }
        else {
            setPrepareState(PrepareState.Finished);
            sendPrepareFinished(prepareSpectrumCards);
        }
    }

    if (prepareSpectrumCards.length == 0) {
        return;
    }

    return (
        <div className="clueComponent">
            <div className="counterWrapper">
                <Counter
                    startTime={startTime}
                    remainingTime={remainingTime}
                />
            </div>

            <div className="counter">
                {spectrumCardCount} von {spectrumCardMaxCount}
            </div>
            
            <h2>Schreiben einen Hinweis</h2>

            <Dial
                hideHand={true}
                showSolution={true}
                solution={prepareSpectrumCards[currentSpectrumCardIndex].realDial}
                scale={prepareSpectrumCards[currentSpectrumCardIndex].scale}
            />

            <input
                type="text"
                maxLength={clueMaxLength}
                value={clue}
                onChange={(event) => setClue(event.target.value)}
            />

            <div className="buttons">
                <button className="actionButton"
                    disabled={skipDisabled}
                    onClick={skipSpectrumCard}
                >
                    Neues Spektrum
                </button>
                <button className="actionButton"
                    disabled={clue.trim().length == 0}
                    onClick={showNextSpectrumCard}
                >
                    Einreichen
                </button>
            </div>
        </div>
    );
}

export default Clue;
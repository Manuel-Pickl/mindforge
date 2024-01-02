import { useState } from "react";
import { usePrepareContext } from "../PrepareContext";
import { useConnectionManagerContext } from "../../../ConnectionManager/ConnectionManagerContext";
import { clueMaxLength, prepareTime, skipsPerCard } from "../../../../Settings";
import Dial from "../../../Dial/Dial";
import "./Clue.scss";
import { PrepareState } from "../../../../types/enums/PrepareState";
import Counter from "../Counter/Counter";

function Clue ()
{
    const [clue, setClue] = useState<string>("");
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [preparedCardsCount, setPreparedCardsCount] = useState<number>(1);
    const [currentSkipCount, setCurrentSkipCount] = useState<number>(0);
    const [skipDisabled, setSkipDisabled] = useState<boolean>(false);
    
    const {
        remainingPrepareTime,
    } = usePrepareContext();

    const {
        setPrepareState,
        prepareSpectrumCards,
        spectrumCardMaxCount,
    } = usePrepareContext();

    const {
        sendPreparedCard
    } = useConnectionManagerContext();

    function skipSpectrumCard() {
        const newSkipCount = currentSkipCount + 1;
        const skipDisabled = newSkipCount >= skipsPerCard;
        setCurrentSkipCount(newSkipCount);
        setSkipDisabled(skipDisabled);

        setClue("");
        setCurrentCardIndex(currentCardIndex + 1);
    }

    function showNextSpectrumCard() {
        prepareSpectrumCards[currentCardIndex].clue = clue;
        sendPreparedCard(prepareSpectrumCards[currentCardIndex]);
        
        setCurrentCardIndex(currentCardIndex + 1);
        setPreparedCardsCount(preparedCardsCount + 1);
        setClue("");
        setCurrentSkipCount(0);
        setSkipDisabled(false);

        const finishedAllSpectrumCards: boolean = preparedCardsCount >= spectrumCardMaxCount;
        if (finishedAllSpectrumCards) {          
            setPrepareState(PrepareState.Finished);
        }
    }

    if (prepareSpectrumCards.length == 0) {
        return;
    }

    return (
        <div className="clueComponent">
            <div className="counterWrapper">
                <Counter
                    startTime={prepareTime}
                    remainingTime={remainingPrepareTime}
                />
            </div>

            <div className="counter">
                {preparedCardsCount} von {spectrumCardMaxCount}
            </div>
            
            <h2>Schreiben einen Hinweis</h2>

            <Dial
                hideHand={true}
                showSolution={true}
                solution={prepareSpectrumCards[currentCardIndex].realDial}
                scale={prepareSpectrumCards[currentCardIndex].scale}
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
import { useState } from "react";
import { usePrepareContext } from "../PrepareContext";
import { useConnectionManagerContext } from "../../../ConnectionManager/ConnectionManagerContext";
import { clueMaxLength, prepareTime, skipsPerCard } from "../../../../Settings";
import Dial from "../../../Dial/Dial";
import "./Clue.scss";
import { PrepareState } from "../../../../types/enums/PrepareState";
import Counter from "../../../Counter/Counter";
import Card from "../../../Card/Card";
import Scroll from "../../../Scroll/Scroll";
import { useAppContext } from "../../../AppContext";
import { getPlayCardsPerPlayer } from "../../../../services/SpectrumCardManager";

function Clue ()
{
    const [clue, setClue] = useState<string>("");
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [preparedCardsCount, setPreparedCardsCount] = useState<number>(1);
    const [currentSkipCount, setCurrentSkipCount] = useState<number>(0);
    const [skipDisabled, setSkipDisabled] = useState<boolean>(false);
    
    const {
        remainingPrepareTime,
        setPrepareState,
        prepareSpectrumCards,
    } = usePrepareContext();

    const {
        sendPreparedCard
    } = useConnectionManagerContext();

    const {
        players,
    } = useAppContext();

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

        const finishedAllSpectrumCards: boolean = preparedCardsCount >= getPlayCardsPerPlayer(players.length);
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

            <Card>
                <div>
                    {preparedCardsCount} von {getPlayCardsPerPlayer(players.length)}
                </div>
                <h3>
                    Schreiben einen Hinweis                
                </h3>
            </Card>

            <Dial
                hideHand={true}
                solutionVisible={true}
                solution={prepareSpectrumCards[currentCardIndex].realDial}
                scale={prepareSpectrumCards[currentCardIndex].scale}
            />

            <div className="input">
                <input
                    type="text"
                    maxLength={clueMaxLength}
                    value={clue}
                    placeholder="Hinweis"
                    onChange={(event) => setClue(event.target.value)}
                />
            </div>

            <div className="buttons">
                <Scroll
                    disabled={skipDisabled}
                    onClick={skipSpectrumCard}
                >
                    Neues Spektrum    
                </Scroll>
                <Scroll
                    disabled={clue.trim().length == 0}
                    onClick={showNextSpectrumCard}
                >
                    Einreichen
                </Scroll>
            </div>
        </div>
    );
}

export default Clue;
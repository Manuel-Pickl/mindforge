import { ReactNode, useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";
import { PrepareContext, usePrepareContext } from "./PrepareContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import { clueMaxLength } from "../../../services/Settings";
import Dial from "../../Dial/Dial";
import "./Prepare.scss";

export const PrepareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [prepareSpectrumCards, setPrepareSpectrumCards] = useState<SpectrumCard[]>([]);
    const [spectrumCardMaxCount, setSpectrumCardMaxCount] = useState<number>(0);

    function startPrepare(aPrepareSpectrumCards: SpectrumCard[], aPrepareSpectrumCount: number) {
        setPrepareSpectrumCards(aPrepareSpectrumCards);
        setSpectrumCardMaxCount(aPrepareSpectrumCount);
    }

    return (<PrepareContext.Provider value={{ prepareSpectrumCards, setPrepareSpectrumCards, spectrumCardMaxCount, setSpectrumCardMaxCount, startPrepare }}>{children}</PrepareContext.Provider>);
};

function Prepare ()
{
    const [clue, setClue] = useState<string>("");
    const [prepareFinished, setPrepareFinished] = useState<boolean>(false);
    const [currentSpectrumCardIndex, setCurrentSpectrumCardIndex] = useState<number>(0);
    const [spectrumCardCount, setSpectrumCardCount] = useState<number>(1);
    const [skipDisabled, setSkipDisabled] = useState<boolean>(false);

    const {
        prepareSpectrumCards, setPrepareSpectrumCards,
        spectrumCardMaxCount,
    } = usePrepareContext();

    const {
        sendPrepareFinished
    } = useConnectionManagerContext();

    function skipSpectrumCard() {
        setSkipDisabled(true);
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
            setSkipDisabled(false);
        }
        else {
            setPrepareFinished(true);
            sendPrepareFinished(prepareSpectrumCards);
        }
    }

    if (prepareSpectrumCards.length == 0) {
        return;
    }

    return (
        <div className="prepareComponent">
            <div className="remainingTime">
                3min
            </div>

            <div className="counter">
                {spectrumCardCount} von {spectrumCardMaxCount}
            </div>
            
            <h2>Schreiben einen Hinweis</h2>

            {!prepareFinished ? (
            <>
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
            </>
            ) : (
            <div>
                warten auf andere Spieler...
            </div>
            )}
        </div>
    );
}

export default Prepare;
import { ReactNode, useState } from "react";
import { SpectrumCard } from "../../../types/SpectrumCard";
import { PrepareContext, usePrepareContext } from "./PrepareContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import { clueMaxLength } from "../../../services/Settings";
import Dial from "../../Dial/Dial";

export const PrepareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [prepareSpectrumCards, setPrepareSpectrumCards] = useState<SpectrumCard[]>([]);

    return (<PrepareContext.Provider value={{ prepareSpectrumCards, setPrepareSpectrumCards }}>{children}</PrepareContext.Provider>);
};

function Prepare ()
{
    const [clue, setClue] = useState<string>("");
    const [prepareFinished, setPrepareFinished] = useState<boolean>(false);
    const [currentSpectrumCardIndex, setCurrentSpectrumCardIndex] = useState<number>(0);
    
    const {
        prepareSpectrumCards, setPrepareSpectrumCards
    } = usePrepareContext();

    const {
        sendPrepareFinished
    } = useConnectionManagerContext();

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
            sendPrepareFinished(prepareSpectrumCards);
        }
    }

    if (prepareSpectrumCards.length == 0) {
        return;
    }

    return (
        <div>
            <h1>Hinweise aufschreiben</h1>
            {!prepareFinished ? (
            <div>
                <h2>{currentSpectrumCardIndex + 1}. Spektrum Karte</h2>

                <Dial
                    hideHand={true}
                    showSolution={true}
                    solution={prepareSpectrumCards[currentSpectrumCardIndex].realDial}
                    scale={prepareSpectrumCards[currentSpectrumCardIndex].scale}
                />

                <br/><br/><br/><br/>

                <input
                    type="text"
                    maxLength={clueMaxLength}
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
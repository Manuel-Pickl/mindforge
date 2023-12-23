import Play from "./Play/Play";
import Prepare from "./Prepare/Prepare";
import { GameState } from "../../types/GameState";
import { SpectrumCard } from "../../types/SpectrumCard";

interface GameProps
{
    gameState: GameState;
    sendPrepareFinished: () => void;
    dial: number;
    setDial: React.Dispatch<React.SetStateAction<number>>;
    updateGlobalDial: (aValue: number) => void;
    prepareSpectrumCards: SpectrumCard[];
    setPrepareSpectrumCards: (aValue: SpectrumCard[]) => void;
    playSpectrumCards: SpectrumCard[];
}

function Game ({
    gameState,
    sendPrepareFinished,
    dial,
    setDial,
    updateGlobalDial,
    prepareSpectrumCards,
    setPrepareSpectrumCards,
    playSpectrumCards}: GameProps)
{
    return (
        <div>
            {gameState == GameState.Prepare && (
                <Prepare
                    sendPrepareFinished={sendPrepareFinished}
                    prepareSpectrumCards={prepareSpectrumCards}
                    setPrepareSpectrumCards={setPrepareSpectrumCards}
                />
            )}

            {gameState == GameState.Play && (
                <Play
                    dial={dial}
                    setDial={setDial}
                    playSpectrumCards={playSpectrumCards}
                    updateGlobalDial={updateGlobalDial}
                />
            )}
        </div>
    );
}

export default Game;
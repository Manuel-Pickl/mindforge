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
    spectrumCards: SpectrumCard[];
    setSpectrumCards: (aValue: SpectrumCard[]) => void;
}

function Game ({
    gameState,
    sendPrepareFinished,
    dial,
    setDial,
    updateGlobalDial,
    spectrumCards,
    setSpectrumCards }: GameProps)
{
    return (
        <div>
            {gameState == GameState.Prepare && (
                <Prepare
                    sendPrepareFinished={sendPrepareFinished}
                    spectrumCards={spectrumCards}
                    setSpectrumCards={setSpectrumCards}
                />
            )}

            {gameState == GameState.Play && (
                <Play
                    dial={dial}
                    setDial={setDial}
                    updateGlobalDial={updateGlobalDial}
                />
            )}
        </div>
    );
}

export default Game;
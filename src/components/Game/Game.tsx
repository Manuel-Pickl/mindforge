import Play from "./Play/Play";
import Prepare from "./Prepare/Prepare";
import { GameState } from "../../types/GameState";
import { SpectrumCard } from "../../types/SpectrumCard";

interface GameProps
{
    sendPlayRoundFinished: (aValue: boolean) => void;
    gameState: GameState;
    sendPrepareFinished: (prepareSpectrumCards: SpectrumCard[]) => void;
    dial: number;
    setDial: React.Dispatch<React.SetStateAction<number>>;
    updateGlobalDial: (aValue: number) => void;
    prepareSpectrumCards: SpectrumCard[];
    setPrepareSpectrumCards: (aValue: SpectrumCard[]) => void;
    playSpectrumCard: SpectrumCard | null;
    currentPlayRound: number;
    roundsCount: number
}

function Game ({
    sendPlayRoundFinished,
    gameState,
    sendPrepareFinished,
    dial,
    setDial,
    updateGlobalDial,
    prepareSpectrumCards,
    setPrepareSpectrumCards,
    playSpectrumCard,
    currentPlayRound,
    roundsCount}: GameProps)
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
                    sendPlayRoundFinished={sendPlayRoundFinished}
                    dial={dial}
                    setDial={setDial}
                    playSpectrumCard={playSpectrumCard}
                    updateGlobalDial={updateGlobalDial}
                    currentPlayRound={currentPlayRound}
                    roundsCount={roundsCount}
                />
            )}
        </div>
    );
}

export default Game;
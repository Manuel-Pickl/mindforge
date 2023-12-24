import Play from "./Play/Play";
import Prepare from "./Prepare/Prepare";
import { GameState } from "../../types/GameState";
import { SpectrumCard } from "../../types/SpectrumCard";
import { Dispatch, SetStateAction } from "react";

interface GameProps
{
    sendPlayRoundFinished: (aValue: boolean) => void;
    gameState: GameState;
    sendPrepareFinished: (prepareSpectrumCards: SpectrumCard[]) => void;
    dial: number;
    setDial: Dispatch<SetStateAction<number>>;
    updateGlobalDial: Dispatch<SetStateAction<number>>;
    prepareSpectrumCards: SpectrumCard[];
    setPrepareSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
    playSpectrumCard: SpectrumCard | null;
    currentPlayRound: number;
    roundsCount: number;
    roundSolutionIsShown: boolean;
    setRoundSolutionIsShown: Dispatch<SetStateAction<boolean>>;
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
    roundsCount,
    roundSolutionIsShown,
    setRoundSolutionIsShown}: GameProps)
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
                    roundSolutionIsShown={roundSolutionIsShown}
                    setRoundSolutionIsShown={setRoundSolutionIsShown}
                />
            )}

            {gameState == GameState.Finish && (
                <div>Result</div>
            )}
        </div>
    );
}

export default Game;
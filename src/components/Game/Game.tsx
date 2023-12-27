import Play from "./Play/Play";
import Prepare from "./Prepare/Prepare";
import { GameState } from "../../types/GameState";
import { SpectrumCard } from "../../types/SpectrumCard";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import Result from "./Result/Result";
import { GameContext, useGameContext } from "./GameContext";

interface GameProps
{
    sendPlayRoundFinished: (aValue: boolean) => void;
    sendPrepareFinished: (prepareSpectrumCards: SpectrumCard[]) => void;
    updateGlobalDial: Dispatch<SetStateAction<number>>;
}

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>(GameState.Prepare);
  
    return (<GameContext.Provider value={{ gameState, setGameState }}>{children}</GameContext.Provider>);
};

function Game ({
    sendPlayRoundFinished,
    sendPrepareFinished,
    updateGlobalDial }: GameProps)
{
    const { gameState } = useGameContext();

    return (
        <div>
            {gameState == GameState.Prepare && (
                <Prepare
                    sendPrepareFinished={sendPrepareFinished}
                />
            )}

            {gameState == GameState.Play && (
                <Play
                    sendPlayRoundFinished={sendPlayRoundFinished}
                    updateGlobalDial={updateGlobalDial}
                />
            )}

            {gameState == GameState.Finish && 
                <Result />
            }
        </div>
    );
}

export default Game;
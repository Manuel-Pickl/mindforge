import Play from "./Play/Play";
import Prepare from "./Prepare/Prepare";
import { GameState } from "../../types/enums/GameState";
import { ReactNode, useState } from "react";
import Result from "./Result/Result";
import { GameContext, useGameContext } from "./GameContext";

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>(GameState.Prepare);
  
    return (<GameContext.Provider value={{ gameState, setGameState }}>{children}</GameContext.Provider>);
};

function Game ()
{
    const { gameState } = useGameContext();

    return (
        <div>
            {gameState == GameState.Prepare && (
                <Prepare />
            )}

            {gameState == GameState.Play && (
                <Play />
            )}

            {gameState == GameState.Finish && 
                <Result />
            }
        </div>
    );
}

export default Game;
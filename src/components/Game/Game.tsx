import Play from "./Play/Play";
import Prepare from "./Prepare/Prepare";
import { GameState } from "../../types/GameState";

interface GameProps
{
    gameState: GameState;
    playerIsReady: () => void;
    dial: number;
    setDial: React.Dispatch<React.SetStateAction<number>>;
    updateGlobalDial: (aValue: number) => void;
}

function Game ({ gameState, playerIsReady, dial, setDial, updateGlobalDial }: GameProps)
{
    return (
        <div>
            {gameState == GameState.Prepare && (
                <Prepare
                    playerIsReady={playerIsReady}
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
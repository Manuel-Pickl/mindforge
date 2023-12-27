import { MutableRefObject  } from "react";
import { useAppContext } from "../../AppContext";

interface LobbyProps
{
    connectionManagerRef: MutableRefObject<any>;
}

function Lobby ({connectionManagerRef }: LobbyProps)
{
    const {
        players,
        isHost,
    } = useAppContext();
    
    return (
        <div>
            {players.size} players: {Array.from(players).map((player) => player.username).join(", ")}

            <br />

            {isHost && players.size >= 2 ? (
                <button
                onClick={connectionManagerRef.current.startPrepare}>
                Start Game
                </button>
            ) : null}
        </div>
    );
}

export default Lobby;
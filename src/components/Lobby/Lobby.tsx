import { useAppContext } from "../../AppContext";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";

function Lobby ()
{
    const {
        players,
        isHost,
    } = useAppContext();
    
    const {
        startPrepare,
    } = useConnectionManagerContext();

    return (
        <div>
            {players.size} players: {Array.from(players).map((player) => player.username).join(", ")}

            <br />

            {isHost && players.size >= 2 ? (
                <button
                onClick={startPrepare}>
                Start Game
                </button>
            ) : null}
        </div>
    );
}

export default Lobby;
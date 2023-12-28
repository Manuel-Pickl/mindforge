import { useAppContext } from "../../AppContext";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";
import GuestCard from "./GuestCard/GuestCard";

function Lobby ()
{
    const {
        players,
        isHost,
        room,
        username,
    } = useAppContext();
    
    const {
        startPrepare,
    } = useConnectionManagerContext();

    return (
        <div>
            <div>Dein Raum ist {room}</div>
            <div>{`localhost:5173/?room=${room}`}</div>
            <div>{`mindforge.netlify.app/?room=${room}`}</div>
            
            <div>{username}</div>

            <div className="guestCards">
                {Array.from(players)
                    .filter(player => player.username !== username)
                    .map(player => (
                        <GuestCard
                            key={player.username}
                            username={player.username}
                            avatar={player.avatar}
                        />
                ))}
            </div>

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
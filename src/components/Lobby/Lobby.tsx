import { Player } from "../../types/Player";

interface LobbyProps
{
    usernameRef: React.MutableRefObject<string>;
    players: Set<Player>;
    isHost: boolean;
    broadcast: (aMessage: string) => void;
    startPrepare: () => void;
}

function Lobby ({ usernameRef, players, isHost, broadcast, startPrepare }: LobbyProps)
{
    return (
        <div>
            {players.size} players: {Array.from(players).map((player) => player.username).join(", ")}
            <br />
            <button 
                onClick={() => broadcast(usernameRef.current)}
            >
                Send Data
            </button>
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
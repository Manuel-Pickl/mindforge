interface LobbyProps
{
    usernameRef: React.MutableRefObject<string>;
    players: Set<string>;
    isHost: boolean;
    broadcast: (aMessage: string) => void;
    startGame: () => void;
}

function Lobby ({ usernameRef, players, isHost, broadcast, startGame }: LobbyProps)
{
    return (
        <div>
            {players.size} players: {[...players].join(", ")}<br />
            <button 
                onClick={() => broadcast(usernameRef.current)}
            >
                Send Data
            </button>
            {isHost && players.size >= 2 ? (
                <button
                onClick={startGame}>
                Start Game
                </button>
            ) : null}
        </div>
    );
}

export default Lobby;
import { MutableRefObject, forwardRef, useImperativeHandle, useState } from "react";
import { Player } from "../../types/Player";

interface LobbyProps
{
    players: Set<Player>;
    connectionManagerRef: MutableRefObject<any>;
}

function Lobby ({
    players,
    connectionManagerRef }: LobbyProps, ref: React.Ref<any>)
{
    const [isHost, setIsHost] = useState<boolean>(true);

    useImperativeHandle(ref, () => ({
        setIsHost,
    }));
    
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

export default forwardRef(Lobby);
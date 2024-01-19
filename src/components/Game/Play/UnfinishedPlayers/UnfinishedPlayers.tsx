import { Dispatch, SetStateAction } from "react";
import { Player } from "../../../../types/class/Player";
import AvatarBubble from "../../../AvatarBubble/AvatarBubble";
import "./UnfinishedPlayers.scss";

interface UnfinishedPlayersProps {
    setUnfinishedPlayersVisible: Dispatch<SetStateAction<boolean>>;
    players: Player[];
  }

function UnfinishedPlayers({
    setUnfinishedPlayersVisible,
    players,
}: UnfinishedPlayersProps) {
    function getUnfinishedPlayers(): Player[] {
        const activePlayers: Player[] = players
            // .filter(player => player.username != playSpectrumCard?.owner);

        const unfinishedPlayers: Player[] = activePlayers
            .filter(player => !player.playRoundFinished);

        return unfinishedPlayers;
    }

    return (
        <div className="unfinishedPlayersComponent">
            <button
                onClick={() => setUnfinishedPlayersVisible(false)}
            >
                x
            </button>

            <div>
                Warten auf Konsens...
            </div>

            <div className="avatars">
                {getUnfinishedPlayers().map((player) => (
                    <AvatarBubble
                        key={player.username}
                        avatar={player.avatar}
                        isHost={player.isHost}
                        username={player.username}
                    />
                ))}
            </div>
        </div>
    )
}

export default UnfinishedPlayers;
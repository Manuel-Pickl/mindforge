import { Player } from "../../../../types/class/Player";
import AvatarBubble from "../../../AvatarBubble/AvatarBubble";
import "./UnfinishedPlayers.scss";

interface UnfinishedPlayersProps {
    players: Player[];
    cardOwner: string | undefined;
  }

function UnfinishedPlayers({
    players,
    cardOwner,
}: UnfinishedPlayersProps) {
    function getUnfinishedPlayers(): Player[] {
        const activePlayers: Player[] = players
            .filter(player => player.username != cardOwner);

        const unfinishedPlayers: Player[] = activePlayers
            .filter(player => !player.playRoundFinished);

        return unfinishedPlayers;
    }

    return (
        <div className="unfinishedPlayersComponent">
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
import { useState } from "react";
import { useAppContext } from "../../AppContext";
import { Avatar } from "../../types/Avatar";
import { Player } from "../../types/Player";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";
import MateCard from "./MateCard/MateCard";
import "./Lobby.scss";
import PlayerCard from "./PlayerCard/PlayerCard";

function Lobby ()
{
    const [activePacks, _setActivePacks] = useState<string>("Standard - Furios");

    const {
        players,
        isHost,
        room,
        username,
    } = useAppContext();
    
    const {
        startPrepare,
    } = useConnectionManagerContext();

    function getMates(): Player[] {
        return Array.from(players)
            .filter(player => player.username != username);
    }

    function getMateCards(): JSX.Element[]
    {
        let mateCards = []
        let mates = getMates();
        let addElementSet = false;

        for (let i: number = 0; i < 7; i++) {
            const currentUser: Player = mates[i];
            
            mateCards.push(
                <MateCard key={i}
                    username={currentUser ? currentUser.username : ""}
                    avatar={currentUser ? currentUser.avatar : Avatar.None}
                    isShareButton={!addElementSet}
                />
            );

            if (!currentUser) {
                addElementSet = true;
            }
        }

        return mateCards;
    }
    
    return (
        <div className="lobbyComponent">
            <div>{activePacks}</div>

            <div>Dein Raum ist {room}</div>            

            <PlayerCard
                username={username}
                avatar={Avatar.Seal}
            />

            <div className="guestCards">
                {getMateCards()}
            </div>

            <br />

            {isHost && players.size >= 2 ? (
            <button
                className="actionButton"
                onClick={startPrepare}
            >
                Start Game
            </button>
            ) : null}
        </div>
    );
}

export default Lobby;
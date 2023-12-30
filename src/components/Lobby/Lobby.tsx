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
    const [activePacks, _setActivePacks] = useState<string[]>(["Standard", "Furios"]);

    const {
        players,
        room,
        username,
        getPlayer,
        getMates,
    } = useAppContext();
    
    const {
        startPrepare,
    } = useConnectionManagerContext();

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
                    isHost={currentUser? currentUser.isHost : false}
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
            <div>{activePacks.join("· ")}</div>

            <div>Dein Raum ist {room}</div>            

            <PlayerCard
                username={username}
                avatar={getPlayer()?.avatar}
                isHost={getPlayer()?.isHost ?? false}
            />

            <div className="guestCards">
                {getMateCards()}
            </div>

            <br />

            {getPlayer()?.isHost ? (
                <button
                    disabled={players.length < 2}
                    className="actionButton"
                    onClick={startPrepare}
                >
                    Starte Spiel
                </button>
            ) : (
                <button
                    disabled={true}
                    className="actionButton"
                >
                    Warten auf Host
                </button>
            )}
        </div>
    );
}

export default Lobby;
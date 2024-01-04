import { useState } from "react";
import { useAppContext } from "../AppContext";
import { Player } from "../../types/class/Player";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";
import AvatarBubble from "../AvatarBubble/AvatarBubble";
import { maxPlayers } from "../../Settings";
import "./Lobby.scss";
import arrowLeft from "../../assets/icons/arrow_left.svg";
import arrowRight from "../../assets/icons/arrow_right.svg";

function Lobby ()
{
    const [activePacks, _setActivePacks] = useState<string[]>(["Standard", "Furios"]);
    
    const {
        room,
        username,
        players,
        getPlayer,
        getMates,
    } = useAppContext();
    
    const {
        startPrepare,
        sendChangeAvatar,
    } = useConnectionManagerContext();

    function getMateCards(): JSX.Element[]
    {
        let mateCards = []
        let mates = getMates();
        let addElementSet = false;

        for (let i: number = 0; i < maxPlayers - 1; i++) {
            const currentUser: Player = mates[i];

            mateCards.push(
                <div className="avatar" key={i}>
                    <AvatarBubble
                        avatar={currentUser?.avatar}
                        isHost={currentUser?.isHost ?? false}
                        isShareButton={!addElementSet}
                        username={currentUser?.username}
                    />
                </div>
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

            <div className="playerBubble">
                <img src={arrowLeft} alt={arrowLeft}
                    className="arrow" 
                    onClick={() => sendChangeAvatar(-1)}
                />
                
                <AvatarBubble
                    avatar={getPlayer()?.avatar}
                    isHost={getPlayer()?.isHost ?? false}
                    username={username}
                />

                <img src={arrowRight} alt={arrowRight}
                    className="arrow"
                    onClick={() => sendChangeAvatar(1)}
                />
            </div>

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
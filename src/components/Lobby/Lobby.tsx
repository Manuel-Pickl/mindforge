import { useState } from "react";
import { useAppContext } from "../AppContext";
import { Player } from "../../types/class/Player";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";
import AvatarBubble from "../AvatarBubble/AvatarBubble";
import { maxPlayers } from "../../Settings";
import "./Lobby.scss";
import Card from "../Card/Card";
import Scroll from "../Scroll/Scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Lobby ()
{
    const [_activePacks, _setActivePacks] = useState<string[]>(["Standard", "Furios"]);
    
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
            {/* <div className="packs">
                {activePacks.map(pack =>
                    <Card>
                        {pack}
                    </Card>
                )}
            </div> */}

            <Card>
                Dein Raum ist {room}
            </Card>            

            <div className="playerBubble">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    onClick={() => sendChangeAvatar(-1)}
                />
                
                <AvatarBubble
                    avatar={getPlayer()?.avatar}
                    isHost={getPlayer()?.isHost ?? false}
                    username={username}
                    fontSize="1.3rem"
                />

                <FontAwesomeIcon
                    icon={faChevronRight}
                    onClick={() => sendChangeAvatar(-1)}
                />
            </div>

            <div className="guestCards">
                <div className="row">
                    {getMateCards().slice(0, 4)}
                </div>
                <div className="row second-row">
                    {getMateCards().slice(4, 7)}
                </div>
            </div>

            {getPlayer()?.isHost ? (
                <Scroll
                    disabled={players.length < 2}
                    onClick={startPrepare}
                >
                    Starte Spiel
                </Scroll>
            ) : (
                <Scroll
                    disabled={true}
                >
                    Warten auf Host
                </Scroll>
            )}
        </div>
    );
}

export default Lobby;
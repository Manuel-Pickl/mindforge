import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { Player } from "../../types/class/Player";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";
import AvatarBubble from "../AvatarBubble/AvatarBubble";
import { maxPlayers, websiteUrl } from "../../Settings";
import "./Lobby.scss";
import Card from "../Card/Card";
import Scroll from "../Scroll/Scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faChevronLeft, faChevronRight, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { changeAvatar } from "../../services/AvatarManager";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import SwipeModal from "../SwipeModal/SwipeModal";

function Lobby ()
{
    const [_activePacks, _setActivePacks] = useState<string[]>(["Standard", "Furios"]);
    const [qrCodeValue, setQrCodeValue] = useState<string>("");
    const [shareVisible, setShareVisible] = useState<boolean>(false);

    const navigate = useNavigate();

    const {
        room, setRoom,
        username,
        players, setPlayers,
        getPlayer,
        getMates,
    } = useAppContext();
    
    const {
        startPrepare,
        sendChangeAvatar,
        createRoom_host,
        joinRoom,
    } = useConnectionManagerContext();

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    useEffect(() => {   
        const parameterRoom: string | null = queryParams.get("room");
        if (!parameterRoom) {
            return;
        }

        setRoom(parameterRoom);
      
        const parameterAction: string | null = queryParams.get("action");
        switch (parameterAction) {
            case "create":
                createRoom_host(parameterRoom);
                break;
            case "join":
                if (username) {
                    joinRoom(parameterRoom);
                }
                else {
                    navigate("/");
                    const message: string = "Wähle einen Namen, bevor du dem Raum beitrittst"
                    alert(message)
                    // toast(message);  
                }
                break;
        }
    }, []);

    useEffect(() => {
        const shareUrl: string = `${websiteUrl}/lobby/?action=join&room=${room}`; 
        setQrCodeValue(shareUrl);
    }, [room]);

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
                        share={share}
                    />
                </div>
            );

            if (!currentUser) {
                addElementSet = true;
            }
        }

        return mateCards;
    }
    
    function switchAvatar(aIndexDelta: number) {
        setPlayers([...changeAvatar(aIndexDelta, username, players)]);
        sendChangeAvatar(aIndexDelta);
    }

    async function share() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Raum Einladung",
                    text: `Trete meinem Raum *${room}* bei.\n`,
                    url: `${websiteUrl}/lobby/?action=join&room=${room}`,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert("Teilen hat nicht funktioniert.")
            // toast(...)
        }
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

            <SwipeModal
                    visible={shareVisible}
                    setVisible={setShareVisible}
            >
                <div className="share">
                    <h2>Einladung</h2>
                    
                    <QRCode
                        value={qrCodeValue}
                        style={{ width: '100%', height: 'auto' }}
                    />
                    <div>
                        Scanne den QR Code, um dem Raum zu joinen.
                    </div>
                </div>
            </SwipeModal>
            
            <Card>
                Dein Raum ist {room}
                <div className="icons">
                    <FontAwesomeIcon
                        icon={faShareFromSquare}
                        onClick={share}
                    />
                    <FontAwesomeIcon
                        icon={faQrcode}
                        onClick={() => setShareVisible(true)}
                    />
                </div>
            </Card>            

            <div className="playerBubble">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    onClick={() => switchAvatar(1)}
                />
                
                <AvatarBubble
                    avatar={getPlayer()?.avatar}
                    isHost={getPlayer()?.isHost ?? false}
                    username={username}
                    fontSize="1.3rem"
                />

                <FontAwesomeIcon
                    icon={faChevronRight}
                    onClick={() => switchAvatar(-1)}
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
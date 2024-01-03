import { ReactNode, useState } from "react";
import { useAppContext } from "../AppContext";
import { Avatar } from "../../types/enums/Avatar";
import { Player } from "../../types/class/Player";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";
import MateCard from "./MateCard/MateCard";
import "./Lobby.scss";
import PlayerCard from "./PlayerCard/PlayerCard";
import { maxPlayers } from "../../Settings";
import { LobbyContext, useLobbyContext } from "./LobbyContext";

export const LobbyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lobbyPlayers, setLobbyPlayers] = useState<Player[]>([]);
  
    return (<LobbyContext.Provider value={{ lobbyPlayers, setLobbyPlayers }}>{children}</LobbyContext.Provider>);
};

function Lobby ()
{
    const [activePacks, _setActivePacks] = useState<string[]>(["Standard", "Furios"]);
    
    const {
        lobbyPlayers,
    } = useLobbyContext();
    
    function getPlayer(): Player | undefined {
        return lobbyPlayers
            .find(player => player.username == username);
    }

    function getMates(): Player[] {
        return lobbyPlayers
            .filter(player =>player.username != username);
    }
    const {
        room,
        username,
        isHost,
    } = useAppContext();
    
    const {
        startPrepare,
    } = useConnectionManagerContext();

    function getMateCards(): JSX.Element[]
    {
        let mateCards = []
        let mates = getMates();
        let addElementSet = false;

        for (let i: number = 0; i < maxPlayers - 1; i++) {
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
                isHost={isHost}
            />

            <div className="guestCards">
                {getMateCards()}
            </div>

            <br />

            {isHost ? (
                <button
                    disabled={lobbyPlayers.length < 2}
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
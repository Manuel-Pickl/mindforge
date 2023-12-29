import { useAppContext } from "../../AppContext";
import { Avatar } from "../../types/Avatar";
import { Player } from "../../types/Player";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";
import GuestCard from "./GuestCard/GuestCard";
import "./Lobby.scss";

function Lobby ()
{
    const {
        players,
        isHost,
        room,
        username,
    } = useAppContext();
    
    const {
        startPrepare,
    } = useConnectionManagerContext();

    function getGuests(): Player[] {
        return Array.from(players)
            .filter(player => player.username != username);
    }

    function getGuestCards(): JSX.Element[]
    {
        let guestCards = []
        let guests = getGuests();
        let addElementSet = false;

        for (let i: number = 0; i < 7; i++) {
            const currentUser: Player = guests[i];
            
            guestCards.push(
                <GuestCard key={i}
                    username={currentUser ? currentUser.username : ""}
                    avatar={currentUser ? currentUser.avatar : Avatar.None}
                    isShareButton={!addElementSet}
                />
            );

            if (!currentUser) {
                addElementSet = true;
            }
        }

        return guestCards;
    }
    
    return (
        <div className="lobbyComponent">
            <div>Dein Raum ist {room}</div>
            <div>{`localhost:5173/?room=${room}`}</div>
            <div>{`mindforge.netlify.app/?room=${room}`}</div>
            
            <div>{username}</div>

            <div className="guestCards">
                {getGuestCards()}
            </div>

            <br />

            {isHost && players.size >= 2 ? (
            <button
                onClick={startPrepare}
            >
                Start Game
            </button>
            ) : null}
        </div>
    );
}

export default Lobby;
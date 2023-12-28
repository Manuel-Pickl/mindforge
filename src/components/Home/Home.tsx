import { useState } from "react";
import { HomeTab } from "../../services/HomeTab";
import Create from "./Create/Create";
import Join from "./Join/Join";
import "./Home.scss";
import { useAppContext } from "../../AppContext";
import { Player } from "../../types/Player";
import { Avatar } from "../../types/Avatar";
import GuestCard from "../Lobby/GuestCard/GuestCard";

function Home ()
{
    const [homeTab, setHomeTab] = useState<HomeTab>(HomeTab.Join);

    const players = new Set<Player>();
    players.add(new Player("Manu", false, false, Avatar.Giraffe));
    players.add(new Player("Michelle", false, false, Avatar.Hippo));
    players.add(new Player("Franzi", false, false, Avatar.Lion));
    players.add(new Player("Lukas", false, false, Avatar.Panda));

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
            
            guestCards.push(<GuestCard key={i}
                username={currentUser ? currentUser.username : ""}
                avatar={currentUser ? currentUser.avatar : Avatar.None}
                isShareButton={!addElementSet}
            />);

            if (!currentUser) {
                addElementSet = true;
            }
        }

        return guestCards;
    }

    const {
        username,
    } = useAppContext();

    return (
        <>
            <button
                onClick={() => setHomeTab(HomeTab.Join)}
            >
                Beitreten
            </button>
            <button
                onClick={() => setHomeTab(HomeTab.Create)}
            >
                Erstellen
            </button>
            <br/>
            
            {homeTab == HomeTab.Join &&
                <Join />
            }

            {homeTab == HomeTab.Create &&
                <Create />
            }

            <div className="guestCards">
                {getGuestCards()}
            </div>
        </>
    );
}

export default Home;
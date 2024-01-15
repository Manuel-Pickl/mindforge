import { ReactNode, useState } from "react";
import "./Home.scss";
import Navigation from "./Navigation/Navigation";
import Scroll from "../Scroll/Scroll";
import { roomIdMaxLength, usernameMaxLength } from "../../Settings";
import { useAppContext } from "../AppContext";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";
import { joinWaitingTime } from "../../services/Constants";
import { HomeContext, useHomeContext } from "./HomeContext";
import { HomeTab } from "../../types/enums/HomeTab";

export const HomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [homeTab, setHomeTab] = useState<HomeTab>(HomeTab.Join);
  
    return (<HomeContext.Provider value={{ homeTab, setHomeTab }}>{children}</HomeContext.Provider>);
};

function Home ()
{
    const [joinInProgress, setJoinInProgress] = useState<boolean>(false);

    const {
        homeTab, setHomeTab,
    } = useHomeContext();

    const {
        username, setUsername,
        room, setRoom,
    } = useAppContext();

    const {
        joinRoom,
        createRoom,
    } = useConnectionManagerContext();

    function onRoomInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputRoom = e.target.value;
        const uppercaseRoom = inputRoom.toUpperCase();
        const checkedRoom = uppercaseRoom.replace(/[^a-zA-Z]/g, '');
    
        setRoom(checkedRoom);
    }

    function buttonDisabled(): boolean {
        if (tabIsActive(HomeTab.Join)) {
            return joinDisabled();
        }
        else {
            return createDisabled();
        }
    }
    
    function joinDisabled() {
        if (joinInProgress) {
            return true;
        }

        const roomIsEmpty: boolean = room.trim().length == 0;
        if (roomIsEmpty) {
            return true;
        }

        const nameIsEmpty: boolean = username.trim().length == 0;
        if (nameIsEmpty) {
            return true;
        }

        return false;
    }

    function createDisabled() {
        const nameIsEmpty: boolean = username.trim().length == 0;
        if (nameIsEmpty) {
            return true;
        }

        return false;
    }
    
    function onButtonClick() {
        if (tabIsActive(HomeTab.Join)) {
            tryJoin();
        } else {
            createRoom();
        }
    }

    function tryJoin() {
        setJoinInProgress(true);
        joinRoom(false);

        setTimeout(() => {
            setJoinInProgress(false);
        }, joinWaitingTime * 1000);
    }

    function tabIsActive(tab: HomeTab): boolean {
        return homeTab == tab;
    }

    return (
        <div className="homeComponent">
            <Navigation
                className="slideUp"
                tabIsActive={tabIsActive}
                setHomeTab={setHomeTab}    
            />
            
            <div className="input slideUp animationDelay4">
                <input
                    type="text"
                    placeholder="Dein Name"
                    maxLength={usernameMaxLength}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            
            <div
                className="input slideUp animationDelay5"
                data-disabled={tabIsActive(HomeTab.Create)}
            >
                <input
                    type="text"
                    placeholder="Raum"
                    maxLength={roomIdMaxLength}
                    value={room}
                    onChange={onRoomInputChange}
                />

                <div className="disabled" />
            </div>

            <Scroll
                className="slideRight animationDelay10"
                disabled={buttonDisabled()}
                onClick={onButtonClick}
            >
                {tabIsActive(HomeTab.Join)
                    ? "Raum beitreten"
                    : "Raum erstellen"
                }
            </Scroll>
        </div>
    );
}

export default Home;
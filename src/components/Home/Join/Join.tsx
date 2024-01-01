import { useAppContext } from "../../AppContext";
import { roomIdMaxLength, usernameMaxLength } from "../../../Settings";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import "./Join.scss";
import { useState } from "react";
import { joinWaitingTime } from "../../../services/Constants";

function Join()
{
    const [joinInProgress, setJoinInProgress] = useState<boolean>(false);

    const {
        username, setUsername,
        room, setRoom,
    } = useAppContext();

    const {
        joinRoom,
    } = useConnectionManagerContext();

    function onRoomInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputRoom = e.target.value;
        const uppercaseRoom = inputRoom.toUpperCase();
        const checkedRoom = uppercaseRoom.replace(/[^a-zA-Z]/g, '');
    
        setRoom(checkedRoom);
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

    function clickOnJoin() {
        setJoinInProgress(true);
        joinRoom(false);

        setTimeout(() => {
            setJoinInProgress(false);
        }, joinWaitingTime);
    }

    return (
        <div className="joinComponent">
            <div className="input">
                Dein Name
                <input
                    type="text"
                    placeholder="Benutzer"
                    maxLength={usernameMaxLength}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            
            <div className="input">
                Raum
                <input
                    type="text"
                    placeholder="Raum"
                    maxLength={roomIdMaxLength}
                    value={room}
                    onChange={onRoomInputChange}
                />
            </div>
            
            <button
                className="actionButton"
                disabled={joinDisabled()}
                onClick={clickOnJoin}
            >
                Raum Beitreten
            </button>
        </div>
    );
}

export default Join;
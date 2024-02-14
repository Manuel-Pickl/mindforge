import { useState } from "react";
import { useAppContext } from "../../AppContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import Scroll from "../../Scroll/Scroll";
import { roomIdMaxLength, usernameMaxLength } from "../../../Settings";
import { joinWaitingTime } from "../../../services/Constants";
import "./Join.scss";
import "./JoinAnimation.scss";

function Join() {
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

    
    function tryJoin() {
        setJoinInProgress(true);
        joinRoom(room);

        setTimeout(() => {
            setJoinInProgress(false);
        }, joinWaitingTime * 1000);
    }

    return (
        <div className="joinComponent">
            <div className="input username">
                <input
                    type="text"
                    placeholder="Dein Name"
                    maxLength={usernameMaxLength}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            
            <div className="input room">
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
                className="scroll"
                disabled={joinDisabled()}
                onClick={tryJoin}
            >
                Raum beitreten
            </Scroll>
        </div>
    );
}

export default Join;
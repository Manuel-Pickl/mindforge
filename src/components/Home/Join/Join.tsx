import { useAppContext } from "../../../AppContext";
import { roomIdLength, usernameMaxLength } from "../../../services/Settings";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";

function Join()
{
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

    return (
        <>
            <div>
                Dein Name
                <input
                    type="text"
                    placeholder="Benutzer"
                    maxLength={usernameMaxLength}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            
            <div>
                Raum
                <input
                    type="text"
                    placeholder="Raum"
                    maxLength={roomIdLength}
                    value={room}
                    onChange={onRoomInputChange}
                />
            </div>
            
            <button
                className="action"
                disabled={joinDisabled()}
                onClick={() => joinRoom(room)}
            >
                Raum Beitreten
            </button>
        </>
    );
}

export default Join;
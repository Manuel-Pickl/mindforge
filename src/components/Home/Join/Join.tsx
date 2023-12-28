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

    return (
        <>
            <input
                type="text"
                placeholder="Benutzer"
                maxLength={usernameMaxLength}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            <br/>
            <input
                type="text"
                placeholder="Raum"
                maxLength={roomIdLength}
                value={room}
                onChange={onRoomInputChange}
                />
            <br/>
            <button
                disabled={room.trim().length == 0}
                onClick={() => joinRoom(room)}
            >
                Raum beitreten
            </button>
        </>
    );
}

export default Join;
import { useAppContext } from "../../AppContext";
import { roomIdLength, usernameMaxLength } from "../../services/Settings";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";

function Home ()
{
    const {
        username, setUsername,
        room, setRoom,
    } = useAppContext();

    const {
        createRoom,
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
                placeholder="user name"
                maxLength={usernameMaxLength}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            <input
                type="text"
                placeholder="Room ID (only for joining)"
                maxLength={roomIdLength}
                value={room}
                onChange={onRoomInputChange}
                />
            <button onClick={createRoom}>Create Room</button>
            <button onClick={() => joinRoom(room)}>Join Room</button>
        </>
    );
}

export default Home;
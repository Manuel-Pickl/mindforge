import { useState } from "react";
import { useAppContext } from "../../AppContext";
import { useConnectionManagerContext } from "../ConnectionManager/ConnectionManagerContext";

function Home ()
{
    const [roomId, setRoomId] = useState<string>("");
    
    const {
        username,
        setUsername,
    } = useAppContext();

    const {
        createRoom,
        joinRoom,
    } = useConnectionManagerContext();

    return (
        <>
            <input
                type="text"
                placeholder="user name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            <input
                type="text"
                placeholder="Room ID (only for joining)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                />
            <button onClick={createRoom}>Create Room</button>
            <button onClick={() => joinRoom(roomId)}>Join Room</button>
        </>
    );
}

export default Home;
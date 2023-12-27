import { MutableRefObject, useState } from "react";
import { useAppContext } from "../../AppContext";

interface HomeProps
{
    connectionManagerRef: MutableRefObject<any>;
}

function Home ({ connectionManagerRef }: HomeProps)
{
    const [roomId, setRoomId] = useState<string>("");
    
    const {
        username,
        setUsername,
    } = useAppContext();

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
            <button onClick={connectionManagerRef.current.createRoom}>Create Room</button>
            <button onClick={() => connectionManagerRef.current?.joinRoom(roomId)}>Join Room</button>
        </>
    );
}

export default Home;
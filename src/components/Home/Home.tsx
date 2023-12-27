import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";

interface HomeProps
{
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
    connectionManagerRef: MutableRefObject<any>;
}

function Home ({ username, setUsername, connectionManagerRef }: HomeProps)
{
    const [roomId, setRoomId] = useState<string>("");
    
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
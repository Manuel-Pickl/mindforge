interface HomeProps
{
    usernameRef: React.MutableRefObject<string>;
    roomIdRef: React.MutableRefObject<string>;
    createRoom: () => void;
    joinRoom: (roomId: string) => void;
}

function Home ({ usernameRef, roomIdRef, createRoom, joinRoom }: HomeProps)
{
    return (
        <>
            <input
                type="text"
                placeholder="user name"
                value={usernameRef.current}
                onChange={(e) => usernameRef.current = e.target.value}
                />
            <input
                type="text"
                placeholder="Room ID (only for joining)"
                value={roomIdRef.current}
                onChange={(e) => roomIdRef.current = e.target.value}
                />
            <button onClick={createRoom}>Create Room</button>
            <button onClick={() => joinRoom(roomIdRef.current)}>Join Room</button>
        </>
    );
}

export default Home;
// Game.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useConnectionManager } from './ConnectionManager';

const Game: React.FC = () => {
  const usernameRef = useRef<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false);
  const [_online, setOnline] = useState<boolean>(false);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 100).toString();
    usernameRef.current = randomNumber;
    setPlayers([usernameRef.current]);
  }, []);

  const {
    createRoom,
    joinRoom
  } = useConnectionManager({ setOnline, setJoinedRoom, setPlayers, usernameRef });  
    
  return (
    <div>
      {joinedRoom ? (
        <div>
          {players.length} players: {players.join(", ")}<br />
          <button 
            // onClick={() => clientRef.current?.publish('lobbyData', 'test')}
          >
            Send Data
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="user name"
            value={usernameRef.current}
            onChange={(e) => usernameRef.current = e.target.value}
          />
          <input
            type="text"
            placeholder="Room ID (only for joining)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={createRoom}>Create Room</button>
          <button onClick={joinRoom}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default Game;

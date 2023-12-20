// Game.tsx
import React, { useEffect, useRef, useState } from 'react';
import { connect, useConnectionManager } from './ConnectionManager';
import { MqttClient } from 'mqtt';

const Game: React.FC = () => {
  const usernameRef = useRef<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false);
  const [online, setOnline] = useState<boolean>(false);
  const [players, setPlayers] = useState<Set<string>>(new Set<string>());
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    console.log("Game component rendered");

    const randomNumber = Math.floor(Math.random() * 100).toString();
    usernameRef.current = randomNumber;

    setPlayers(new Set([usernameRef.current]));
    console.log(new Set([usernameRef.current]))
    clientRef.current = connect();
  }, []);
  
  const {
    createRoom,
    joinRoom
  } = useConnectionManager({ clientRef, setOnline, setJoinedRoom, setPlayers, usernameRef });  
  
  if (!online) {
    return <div>Not online</div>;
  }

  return (
    <div>
      {joinedRoom ? (
        <div>
          {players.size} players: {[...players].join(", ")}<br />
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
            onChange={(e) => setRoomId(e.target.value.toString())}
          />
          <button onClick={createRoom}>Create Room</button>
          <button onClick={joinRoom}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default Game;

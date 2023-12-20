// Game.tsx
import React, { useEffect, useState } from 'react';
import { useConnectionManager } from './ConnectionManager';
import { PeerData } from './Data';
import { Topic } from './Topic';

const Game: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false);

  const [players, setPlayers] = useState<string[]>([]);
  
  useEffect(() => {
    setUsername(Math.floor(Math.random() * 100).toString());
    setPlayers([username]);
  }, [])

  function onData(data: PeerData) {
    switch(data.topic) {
      // host site
      case Topic.Join:
        const newPlayer: string = data.data;
        players.push(newPlayer);
        setPlayers([...players]);
        
        broadcast(new PeerData(Topic.LobbyData, players))
        break;

      // guest site
      case Topic.LobbyData:
        const lobbyPlayers: string[] = data.data
        setPlayers([...lobbyPlayers]);
        break;
    }
  }
  const {
    // peer,
    broadcast,
    initializeHost,
    initializeGuest
  } = useConnectionManager({ username, inputValue, onData });

    const createRoom = () => {
      initializeHost();
      setJoinedRoom(true);
    };
  
    const joinRoom = () => {
      initializeGuest();
      setJoinedRoom(true);
    };

  return (
    <div>
      <h1>Username: {username}</h1>
      {joinedRoom ? (
        <div>
          {players.length} players: {players.join(", ")}<br />
          <button onClick={() => broadcast(new PeerData(Topic.LobbyData, "test"))}>
            Send Data
          </button>
          <br/>
          {/* room id: {peer.id} */}
        </div>
      ) : (
        <div>
          <button onClick={createRoom}>Create Room</button>
          <hr />
          <input
            type="text"
            placeholder="Enter Room Code"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default Game;

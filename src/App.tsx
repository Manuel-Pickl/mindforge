// Game.tsx
import { useEffect, useRef, useState } from 'react';
import { MqttClient } from 'mqtt';
import Home from './components/Home/Home';
import { connect, useConnectionManager } from './services/ConnectionManager';
import { debugLog } from './services/Logger';
import { Page } from './types/Page';
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';


function App() {
  const usernameRef = useRef<string>("");
  const roomIdRef = useRef<string>("");
  const [players, setPlayers] = useState<Set<string>>(new Set<string>());
  const [isHost, setIsHost] = useState<boolean>(false);

  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [page, setPage] = useState<Page>(Page.Home);
  
  const clientRef = useRef<MqttClient | null>(null);
  
  useEffect(() => {
    debugLog("Game component rendered");

    const randomNumber = Math.floor(Math.random() * 100).toString();
    usernameRef.current = randomNumber;

    setPlayers(new Set([usernameRef.current]));
    
    clientRef.current = connect();
    clientRef.current?.on('message', onMessage);
  }, []);
  
  const {
    onMessage,
    broadcast,
    createRoom,
    joinRoom,
    startGame,
  } = useConnectionManager(
    clientRef,
    setIsOnline,
    setPage,
    setPlayers,
    usernameRef,
    setIsHost);  
  
  if (!isOnline) {
    return <div>Not online</div>;
  }
  
  return (
    <>
      {page == Page.Home && (
        <Home 
          usernameRef={usernameRef}
          roomIdRef={roomIdRef}
          createRoom={createRoom}
          joinRoom={joinRoom}
        />
      )}
    
      {page == Page.Lobby && (
        <Lobby 
          usernameRef={usernameRef}
          players={players}
          isHost={isHost}
          broadcast={broadcast}
          startGame={startGame}
        />
      )}

      {page == Page.Game && (
        <Game />
      )}
    </>
  );
};

export default App;
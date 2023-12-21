// Game.tsx
import { useEffect, useRef, useState } from 'react';
import Home from './components/Home/Home';
import { Page } from './types/Page';
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';
import ConnectionManager from './components/ConnectionManager';


function App() {
  const usernameRef = useRef<string>("");
  const roomIdRef = useRef<string>("");
  const [players, setPlayers] = useState<Set<string>>(new Set<string>());
  const [isHost, setIsHost] = useState<boolean>(false);
  const [page, setPage] = useState<Page>(Page.Offline);  
  const [dial, setDial] = useState<number>(50);
  
  const connectionManagerRef = useRef<any>();
  
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 100).toString();
    usernameRef.current = randomNumber;

    setPlayers(new Set([usernameRef.current]));
  }, []);


  return (
    <>
      <ConnectionManager
        ref={connectionManagerRef}
        setPage={setPage}
        setPlayers={setPlayers}
        usernameRef={usernameRef}
        setIsHost={setIsHost}
        setDial={setDial}
      />

      {page == Page.Offline && (
        <>Offline</>
      )}

      {page == Page.Home && (
        <Home 
          usernameRef={usernameRef}
          roomIdRef={roomIdRef}
          createRoom={connectionManagerRef.current?.createRoom}
          joinRoom={connectionManagerRef.current?.joinRoom}
        />
      )}
    
      {page == Page.Lobby && (
        <Lobby 
          usernameRef={usernameRef}
          players={players}
          isHost={isHost}
          broadcast={connectionManagerRef.current?.broadcast}
          startGame={connectionManagerRef.current?.startGame}
        />
      )}

      {page == Page.Game && (
        <Game
          dial={dial}
          setDial={setDial}
          changeDial={connectionManagerRef.current?.changeDial}
        />
      )}
    </>
  );
};

export default App;
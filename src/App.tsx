// App.tsx
import { useRef, useState } from 'react';
import Home from './components/Home/Home';
import { Page } from './types/Page';
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';
import ConnectionManager from './components/ConnectionManager/ConnectionManager';
import { Player } from './types/Player';
import { SpectrumCard } from './types/SpectrumCard';
import { useLocation } from 'react-router-dom';

function App() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const [username, setUsername] = useState<string>(queryParams.get('username') || "");
  const [players, setPlayers] = useState<Set<Player>>(new Set());
  const [isHost, setIsHost] = useState<boolean>(false);
  const [page, setPage] = useState<Page>(Page.Offline);
  const [spectrumCards, setSpectrumCards] = useState<SpectrumCard[]>([]);

  const connectionManagerRef = useRef<any>();
  
  return (
    <>
      {page == Page.Offline && (
        <>Offline</>
      )}

      {page == Page.Home && (
        <Home 
          username={username}
          setUsername={setUsername}
          connectionManagerRef={connectionManagerRef}
        />
      )}
    
      {page == Page.Lobby && (
        <Lobby 
          players={players}
          connectionManagerRef={connectionManagerRef}
        />
      )}

      {page == Page.Game && (
        <Game
          sendPlayRoundFinished={connectionManagerRef.current?.sendPlayRoundFinished}
          sendPrepareFinished={connectionManagerRef.current?.sendPrepareFinished}
          updateGlobalDial={connectionManagerRef.current?.updateGlobalDial}
        />
      )}

      <ConnectionManager
        ref={connectionManagerRef}
        setPage={setPage}
        setPlayers={setPlayers}
        setUsername={setUsername}
        spectrumCards={spectrumCards}
        setSpectrumCards={setSpectrumCards}
      />
    </>
  );
};

export default App;
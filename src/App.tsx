// App.tsx
import { ReactNode, useRef, useState } from 'react';
import Home from './components/Home/Home';
import { Page } from './types/Page';
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';
import ConnectionManager from './components/ConnectionManager/ConnectionManager';
import { Player } from './types/Player';
import { SpectrumCard } from './types/SpectrumCard';
import { useLocation } from 'react-router-dom';
import { AppContext, useAppContext } from './AppContext';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {  
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  
  const [page, setPage] = useState<Page>(Page.Offline);
  const [username, setUsername] = useState<string>(queryParams.get('username') || "");
  const [players, setPlayers] = useState<Set<Player>>(new Set());
  const [isHost, setIsHost] = useState<boolean>(false);
  const [spectrumCards, setSpectrumCards] = useState<SpectrumCard[]>([]);

  return (<AppContext.Provider value={{ page, setPage, username, setUsername, players, setPlayers, isHost, setIsHost,spectrumCards, setSpectrumCards  }}>{children}</AppContext.Provider>);
};

function App() {
  const connectionManagerRef = useRef<any>();

  const {
    page,
  } = useAppContext();
  
  return (
    <>
      {page == Page.Offline && (
        <>
          Offline
        </>
      )}

      {page == Page.Home && (
        <Home 
          connectionManagerRef={connectionManagerRef}
        />
      )}
    
      {page == Page.Lobby && (
        <Lobby 
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
      />
    </>
  );
};

export default App;
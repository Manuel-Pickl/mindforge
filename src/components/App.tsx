// App.tsx
import { ReactNode, useEffect, useState } from 'react';
import Home from './Home/Home';
import { Page } from '../types/enums/Page';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';
import ConnectionManager from './ConnectionManager/ConnectionManager';
import { useLocation } from 'react-router-dom';
import { AppContext, useAppContext } from './AppContext';
import Offline from './Offline/Offline';
import "./App.scss";
import { Player } from '../types/class/Player';
import { useHomeContext } from './Home/HomeContext';
import { HomeTab } from '../types/enums/HomeTab';
import LeavePrompt from './LeavePrompt/LeavePrompt';
import Dial from './Dial/Dial';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) =>
{
  const [page, setPage] = useState<Page>(Page.Offline);
  const [username, setUsername] = useState<string>(sessionStorage.getItem("username") ?? "");
  const [room, setRoom] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);

  function getPlayer(aUsername: string | null = null): Player | undefined {
    return players.find(player =>
      player.username == (aUsername ?? username));
  }

  function getMates(): Player[] {
    return players
      .filter(player =>player.username != username);
  }

  return (<AppContext.Provider value={{ page, setPage, username, setUsername, room, setRoom, players, setPlayers, getPlayer, getMates }}>{children}</AppContext.Provider>);
};

function App() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const {
    page,
    username,
    setRoom,
  } = useAppContext();

  const {
    setHomeTab,
  } = useHomeContext();

  useEffect(() => {   
    const parameterRoom: string | null = queryParams.get('room');
    if (parameterRoom) {
      setRoom(parameterRoom);
    }

    const parameterTab: string | null = queryParams.get('tab');
    if (parameterTab) {
      setHomeTab(parameterTab as unknown as HomeTab);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("username", username);
  }, [username]);

  // ToDo ma.pickl: debug code for dial testing
  const [test, setTest] = useState<number>(80);
  function onDialChange(aValue: number, x: number, y: number) {
    if (x >= 0 && x <= 100
      && y >= 0 && y <= 100) {
      console.log(`x=${x}, y=${y}`)
    }

    setTest(aValue);
  }

  return (
    <div className="appComponent">
      {page == Page.Offline && (
        <Offline />
      )}

      {page == Page.Home && (
        <Home />
      )}
    
      {page == Page.Lobby && (
        <Lobby />
      )}

      {page == Page.Game && (
        <Game />
      )}

      <LeavePrompt
        page={page} 
      />
      <ConnectionManager />

      {/* <Dial 
        hideHand={false}
        solutionVisible={false}
        solution={0}
        dial={test}
        scale={["", ""]}
        onDialChange={onDialChange}
      /> */}
    </div>
  );
};

export default App;
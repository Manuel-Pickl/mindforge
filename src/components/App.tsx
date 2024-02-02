// App.tsx
import { ReactNode, useEffect, useState } from 'react';
import Home from './Home/Home';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';
import ConnectionManager from './ConnectionManager/ConnectionManager';
import { Route, Routes } from 'react-router-dom';
import { AppContext, useAppContext } from './AppContext';
import Offline from './Offline/Offline';
import "./App.scss";
import { Player } from '../types/class/Player';
import LeavePrompt from './LeavePrompt/LeavePrompt';
import Result from './Game/Result/Result';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) =>
{
  const [offline, setOffline] = useState<boolean>(true);
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

  return (<AppContext.Provider value={{ offline, setOffline, username, setUsername, room, setRoom, players, setPlayers, getPlayer, getMates }}>{children}</AppContext.Provider>);
};

function App() {
  const {
    offline,
    username,
  } = useAppContext();

  useEffect(() => {
    sessionStorage.setItem("username", username);
  }, [username]);

  return (
    <div className="appComponent">
      {offline &&
        <Offline />
      }


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
        <Route path="/result" element={<Result />} />
      </Routes>

      <LeavePrompt />
      <ConnectionManager />
    </div>
  );
};

export default App;
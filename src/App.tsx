// Game.tsx
import { useEffect, useRef, useState } from 'react';
import Home from './components/Home/Home';
import { Page } from './types/Page';
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';
import ConnectionManager from './components/ConnectionManager';
import { Player } from './types/Player';
import { GameState } from './types/GameState';
import { SpectrumCard } from './types/SpectrumCard';


function App() {
  const usernameRef = useRef<string>("");
  const roomIdRef = useRef<string>("");
  const [players, setPlayers] = useState<Set<Player>>(new Set());
  const [isHost, setIsHost] = useState<boolean>(false);
  const [page, setPage] = useState<Page>(Page.Offline);  
  const [dial, setDial] = useState<number>(50);
  const [gameState, setGameState] = useState<GameState>(GameState.Prepare);
  const [prepareSpectrumCards, setPrepareSpectrumCards] = useState<SpectrumCard[]>([]);
  const [spectrumCards, setSpectrumCards] = useState<SpectrumCard[]>([]);
  const [playSpectrumCard, setPlaySpectrumCard] = useState<SpectrumCard | null>(null);
  const [currentPlayRound, setCurrentPlayRound] = useState<number>(1);
  const connectionManagerRef = useRef<any>();
  
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 100).toString();
    usernameRef.current = randomNumber;
  }, []);


  return (
    <>
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
          startPrepare={connectionManagerRef.current?.startPrepare}
        />
      )}

      {page == Page.Game && (
        <Game
          sendPlayRoundFinished={connectionManagerRef.current?.sendPlayRoundFinished}
          gameState={gameState}
          sendPrepareFinished={connectionManagerRef.current?.sendPrepareFinished}
          dial={dial}
          setDial={setDial}
          updateGlobalDial={connectionManagerRef.current?.updateGlobalDial}
          prepareSpectrumCards={prepareSpectrumCards}
          setPrepareSpectrumCards={setPrepareSpectrumCards}
          playSpectrumCard={playSpectrumCard}
        />
      )}

      <ConnectionManager
        ref={connectionManagerRef}
        setPage={setPage}
        players={players}
        setPlayers={setPlayers}
        usernameRef={usernameRef}
        setIsHost={setIsHost}
        setDial={setDial}
        setGameState={setGameState}
        prepareSpectrumCards={prepareSpectrumCards}
        setPrepareSpectrumCards={setPrepareSpectrumCards}
        spectrumCards={spectrumCards}
        setSpectrumCards={setSpectrumCards}
        currentPlayRound={currentPlayRound}
        setCurrentPlayRound={setCurrentPlayRound}
        setPlaySpectrumCard={setPlaySpectrumCard}
      />
    </>
  );
};

export default App;
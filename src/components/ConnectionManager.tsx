import { Dispatch, MutableRefObject, SetStateAction, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Topic } from '../types/Topic';
import mqtt, { MqttClient } from 'mqtt';
import { Page } from '../types/Page';
import { debugLog } from '../services/Logger';
import MqttHelper from './MqttHelper';
import { Player } from '../types/Player';
import { GameState } from '../types/GameState';
import { SpectrumCard } from '../types/SpectrumCard';
import { getInitialSpectrumCards } from '../services/SpectrumCardManager';

interface ConnectionManagerProps {
  setPage: Dispatch<SetStateAction<Page>>;
  players: Set<Player>;
  setPlayers: Dispatch<SetStateAction<Set<Player>>>;
  usernameRef: MutableRefObject<string>;
  setIsHost: Dispatch<SetStateAction<boolean>>;
  setDial: Dispatch<SetStateAction<number>>;
  setGameState: Dispatch<SetStateAction<GameState>>;
  spectrumCards: SpectrumCard[];
  setSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
  prepareSpectrumCards: SpectrumCard[];
  setPrepareSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
  currentPlayRound: number;
  setCurrentPlayRound: Dispatch<SetStateAction<number>>;
  roundsCount: number;
  setRoundsCount: Dispatch<SetStateAction<number>>;
  setPlaySpectrumCard: Dispatch<SetStateAction<SpectrumCard | null>>;
}

function ConnectionManager({
  setPage,
  players,
  setPlayers,
  usernameRef,
  setIsHost,
  setDial,
  setGameState,
  spectrumCards,
  setSpectrumCards,
  prepareSpectrumCards,
  setPrepareSpectrumCards,
  currentPlayRound,
  setCurrentPlayRound,
  roundsCount,
  setRoundsCount,
  setPlaySpectrumCard}: ConnectionManagerProps,
  ref: React.Ref<any>)
{
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
  const mqttHelperRef = useRef<any>();
  let connectionLostTime: number | null = null;

  useEffect(() => {
    const protocoll: string = "wss";
    const address: string = "test.mosquitto.org";
    const port: string = "8081";
    const mqttUrl = `${protocoll}://${address}:${port}`;
    const mqttClient: MqttClient = mqtt.connect(mqttUrl);

    mqttClient.on('message', onMessage);
    mqttClient.on('connect', onConnect);
    mqttClient.on('close', () => {
      connectionLostTime = Date.now();
    });

    setMqttClient(mqttClient);
  }, []);
  
  // host & client
  function onMessage(aPaddedTopic: string, aData: any) {
    const {topic, data} = mqttHelperRef.current.parseMessage(aPaddedTopic, aData);
    debugLog(`${topic}: ${data}`);

    switch(topic) {
      case Topic.Broadcast:
        alert(data);
        break;
      case Topic.Join:
        onJoin(data);
        break;
      case Topic.LobbyData:
        onLobbyData(new Set(data))
        break;
      case `${Topic.StartPrepare}/${usernameRef.current}`:
        onStartPrepare(data);
        break;
      case Topic.UpdateGlobalDial:
        onUpdateGlobalDial(data);
        break;
      case Topic.PrepareFinished:
        onPrepareFinished(data)
        break;
      case Topic.StartPlayRound:
        onStartPlay(data);
        break;
      case Topic.PlayRoundFinished:
        onPlayRoundFinished(data);
        break;
      default:
        console.log("error: unknown topic!");
        console.log(topic);
    }
  }

  function onConnect() {
    if (connectionLostTime) {
      const connectionLostSpan = (Date.now() - connectionLostTime) / 1000;
      debugLog(`reconnected to broker in ${connectionLostSpan}s`);
    }
    else {
      debugLog("connected to broker");
    }
    
    setPage(Page.Home);
  }

  // host
  function createRoom() {
    mqttHelperRef.current.subscribe(Topic.Join);
    setIsHost(true);
    joinRoom("");
  }
  
  // host
  function onJoin(aUsername: string) {
    setPlayers((oldPlayers) => {
      const updatedPlayers = new Set(oldPlayers);
      updatedPlayers.add(new Player(aUsername));

      mqttHelperRef.current.publish(Topic.LobbyData, [...updatedPlayers]);
      
      return updatedPlayers;
    });
  }

  // host
  function startPrepare() {
    const initialSpectrumCards: SpectrumCard[] = getInitialSpectrumCards(players);
    players.forEach(player => {
      const spectrumCardsForPlayer: SpectrumCard[] = initialSpectrumCards
        .filter(x => x.owner == player.username);
      mqttHelperRef.current.publish(`${Topic.StartPrepare}/${player.username}`, spectrumCardsForPlayer);
    });

    mqttHelperRef.current.subscribe(Topic.PrepareFinished);
  }

  // host
  function onPrepareFinished(aPrepareSpectrumCards: SpectrumCard[]) {
    const correspondingUsername = aPrepareSpectrumCards[0].owner;

    // we have to nest the update functions, because React is shit
    setSpectrumCards(spectrumCards => {
      const newPlaySpectrumCards = [...spectrumCards, ...aPrepareSpectrumCards];

      setPlayers((oldPlayers) => {
        const updatedPlayers = new Set<Player>(
          Array.from(oldPlayers).map((player) =>
            player.username === correspondingUsername
              ? new Player(player.username, true)
              : player
          )
        );
  
        const allPlayersPrepareFinished = Array.from(updatedPlayers).every(
          (player) => player.prepareFinished
        );
        if (allPlayersPrepareFinished) {
          startPlay(newPlaySpectrumCards);
        }
  
        return updatedPlayers;
      });
  
      return newPlaySpectrumCards;
    });
  }

  // host
  function startPlay(aSpectrumCards: SpectrumCard[]) {
    mqttHelperRef.current.subscribe(Topic.PlayRoundFinished);
    
    const shuffledSpectrumCards: SpectrumCard[] =
      aSpectrumCards.sort(() => Math.random() - 0.5);
    startPlayRound(shuffledSpectrumCards);
    setSpectrumCards([...shuffledSpectrumCards]);
  }

  // host
  function startPlayRound(aSpectrumCards: SpectrumCard[]) {
    setCurrentPlayRound(aCurrentPlayRound => {
      setPlayers(aPlayers => {
        aPlayers.forEach(player => {
          player.playRoundFinished = false;
        })
        return aPlayers;
      });
  
      updateGlobalDial(50);

      const currentSpectrumCardIndex = aCurrentPlayRound;
      const playSpectrumCard: SpectrumCard = aSpectrumCards[currentSpectrumCardIndex];
      const newCurrentPlayRound: number = aCurrentPlayRound + 1;
      
      mqttHelperRef.current.publish(Topic.StartPlayRound, {
        aPlaySpectrumCard: playSpectrumCard,
        aCurrentRound: newCurrentPlayRound,
        aRoundsCount: aSpectrumCards.length,
      });
      
      return newCurrentPlayRound;
    });
  }

  // host
  function onPlayRoundFinished({ aUsername, aPlayRoundFinished }) {
    setSpectrumCards(aSpectrumCards => {
      setPlayers((aPlayers) => {
        const updatedPlayers = new Set<Player>(
          Array.from(aPlayers).map((player) =>
            player.username === aUsername
              ? new Player(player.username, player.prepareFinished, aPlayRoundFinished)
              : player
          )
        );

        const allPlayersPlayRoundFinished = Array.from(updatedPlayers).every(
          (player) => player.playRoundFinished
        );
        if (allPlayersPlayRoundFinished) {
          // const playFinished: boolean = currentPlayRound >= roundsCount;
          // if (playFinished) {
          //   showResults();
          // }
          // else {
            startPlayRound(aSpectrumCards);
          // }
        }

        return updatedPlayers;
      });

      return aSpectrumCards;
    });
  }
  
  // host
  function showResults() {

  }
  
  function broadcast(aMessage: string) {
    mqttHelperRef.current.publish(Topic.Broadcast, aMessage)
  }
  

  function joinRoom(_roomId: string) {
    mqttHelperRef.current.publish(Topic.Join, usernameRef.current);
    subscribeGuest();
    setPage(Page.Lobby);
  };
  
  function onLobbyData(aPlayers: Set<Player>) {
    const updatedPlayers = new Set(aPlayers);
    setPlayers(updatedPlayers);
  }


  function onStartPrepare(spectrumCards: SpectrumCard[]) {
    setPrepareSpectrumCards([...spectrumCards])
    setPage(Page.Game);
  }
  
  function sendPrepareFinished(aPrepareSpectrumCards: SpectrumCard[]) {
    mqttHelperRef.current.publish(Topic.PrepareFinished, aPrepareSpectrumCards);
  }

  
  function onStartPlay({ aPlaySpectrumCard, aCurrentRound, aRoundsCount }) {
    setPlaySpectrumCard(aPlaySpectrumCard);
    setCurrentPlayRound(aCurrentRound);
    setRoundsCount(aRoundsCount);
    setGameState(GameState.Play);
  }

  function updateGlobalDial(aValue: number) {
    mqttHelperRef.current.publish(Topic.UpdateGlobalDial, aValue);
  }
  
  function onUpdateGlobalDial(aValue: number) {
    // ToDo: don't update, if the update comes from the user itself
    
    setDial(aValue);
  }

  function sendPlayRoundFinished(aValue: boolean) {
    mqttHelperRef.current.publish(Topic.PlayRoundFinished, {
      aUsername: usernameRef.current,
      aPlayRoundFinished: aValue
    });
  }



  function subscribeGuest() {
    mqttHelperRef.current.subscribe(Topic.Broadcast);
    mqttHelperRef.current.subscribe(Topic.LobbyData);
    mqttHelperRef.current.subscribe(`${Topic.StartPrepare}/${usernameRef.current}`);
    mqttHelperRef.current.subscribe(Topic.StartPlayRound);
    mqttHelperRef.current.subscribe(Topic.UpdateGlobalDial);
  }

  // Expose methods through ref forwarding
  useImperativeHandle(ref, () => ({
    broadcast,
    createRoom,
    joinRoom,
    startPrepare,
    updateGlobalDial,
    sendPrepareFinished,
    sendPlayRoundFinished,
  }));
  
  return (
    <div>
      <MqttHelper
        ref={mqttHelperRef}
        mqttClient={mqttClient}  
      />
    </div>
  );
}

export default forwardRef(ConnectionManager);
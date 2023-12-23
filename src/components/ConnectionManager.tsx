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
  playSpectrumCards: SpectrumCard[];
  setPlaySpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
  prepareSpectrumCards: SpectrumCard[];
  setPrepareSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
}

function ConnectionManager({
  setPage,
  players,
  setPlayers,
  usernameRef,
  setIsHost,
  setDial,
  setGameState,
  // playSpectrumCards,
  setPlaySpectrumCards,
  prepareSpectrumCards,
  setPrepareSpectrumCards}: ConnectionManagerProps,
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
      case Topic.StartPlay:
        onStartPlay(data);
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
      const correspondingSpectrumCards: SpectrumCard[] = initialSpectrumCards
        .filter(x => x.owner == player.username);
      mqttHelperRef.current.publish(`${Topic.StartPrepare}/${player.username}`, correspondingSpectrumCards);
    });

    mqttHelperRef.current.subscribe(Topic.PrepareFinished);
  }

  // host
  function onPrepareFinished(aPrepareSpectrumCards: SpectrumCard[]) {
    const correspondingUsername = aPrepareSpectrumCards[0].owner;

    // we have to nest the update functions, because React is shit
    setPlaySpectrumCards(oldPlaySpectrumCards => {
      const newPlaySpectrumCards = [...oldPlaySpectrumCards, ...aPrepareSpectrumCards];

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
  function startPlay(aPlaySpectrumCards: SpectrumCard[]) {
    mqttHelperRef.current.publish(Topic.StartPlay, aPlaySpectrumCards);
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
  
  function sendPrepareFinished() {
    mqttHelperRef.current.publish(Topic.PrepareFinished, prepareSpectrumCards);
  }

  function updateGlobalDial(aValue: number) {
    mqttHelperRef.current.publish(Topic.UpdateGlobalDial, aValue);
  }
  
  function onStartPlay(aPlaySpectrumCards: SpectrumCard[]) {
    setPlaySpectrumCards([...aPlaySpectrumCards]);
    setGameState(GameState.Play);
  }

  function onUpdateGlobalDial(aValue: number) {
    // don't update, if the update comes from the user itself

    setDial(aValue);
  }



  function subscribeGuest() {
    mqttHelperRef.current.subscribe(Topic.Broadcast);
    mqttHelperRef.current.subscribe(Topic.LobbyData);
    mqttHelperRef.current.subscribe(`${Topic.StartPrepare}/${usernameRef.current}`);
    mqttHelperRef.current.subscribe(Topic.StartPlay);
    mqttHelperRef.current.subscribe(Topic.UpdateGlobalDial);
    mqttHelperRef.current.subscribe(usernameRef.current);
  }

  // Expose methods through ref forwarding
  useImperativeHandle(ref, () => ({
    broadcast,
    createRoom,
    joinRoom,
    startPrepare,
    updateGlobalDial,
    sendPrepareFinished,
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
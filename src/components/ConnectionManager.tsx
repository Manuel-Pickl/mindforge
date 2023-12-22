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
  setSpectrumCards: (aValue: SpectrumCard[]) => void;
}

function ConnectionManager({
  setPage,
  players,
  setPlayers,
  usernameRef,
  setIsHost,
  setDial,
  setGameState,
  setSpectrumCards}: ConnectionManagerProps,
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
        updateLobbydata(new Set(data))
        break;
      case `${Topic.StartPrepare}/${usernameRef.current}`:
        onStart(data);
        break;
      case Topic.UpdateGlobalDial:
        if (data != usernameRef.current) {
          setDial(data);
        }
        break;
      case Topic.PlayerIsReady:
        onPlayerReady(data)
        break;
      case Topic.StartPlay:
        setGameState(GameState.Play);
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
      console.log("connected to broker");
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

    mqttHelperRef.current.subscribe(Topic.PlayerIsReady);
  }

  // host
  function onPlayerReady(aUsername: string) {
    setPlayers((oldPlayers) => {
      const updatedPlayers = new Set<Player>(
        Array.from(oldPlayers).map((player) =>
          player.username === aUsername ? new Player(player.username, true) : player
        )
      );
      
      const allPlayersAreReady = Array.from(updatedPlayers)
        .every((player) => player.isReady);
      if (allPlayersAreReady) {
        mqttHelperRef.current.publish(Topic.StartPlay);
      }      

      return updatedPlayers;
    });
  }
  
  function broadcast(aMessage: string) {
    mqttHelperRef.current.publish(Topic.Broadcast, aMessage)
  }
  
  function joinRoom(_roomId: string) {
    mqttHelperRef.current.publish(Topic.Join, usernameRef.current);
    subscribeGuest();
    setPage(Page.Lobby);
  };
  
  function updateLobbydata(aPlayers: Set<Player>) {
    const updatedPlayers = new Set(aPlayers);
    setPlayers(updatedPlayers);
  }

  function updateGlobalDial(aValue: number) {
    mqttHelperRef.current.publish(Topic.UpdateGlobalDial, aValue);
  }

  function playerIsReady() {
    mqttHelperRef.current.publish(Topic.PlayerIsReady, usernameRef.current);
  }
  
  function onStart(spectrumCards: SpectrumCard[]) {
    setSpectrumCards([...spectrumCards])
    setPage(Page.Game);
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
    playerIsReady,
  }));
  
  return (
    <MqttHelper
      ref={mqttHelperRef}
      mqttClient={mqttClient}  
    />
  );
}

export default forwardRef(ConnectionManager);
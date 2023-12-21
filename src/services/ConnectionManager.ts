// ConnectionManager.ts
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Topic } from '../types/Topic';
import mqtt, { MqttClient } from 'mqtt';
import { Page } from '../types/Page';
import { debugLog } from './Logger';
import { useMqttHelper } from './MqttHelper';

const protocoll: string = "wss";
const address: string = "test.mosquitto.org";
const port: string = "8081";

export function connect(){
  const mqttUrl = `${protocoll}://${address}:${port}`;
  const mqttClient: MqttClient = mqtt.connect(mqttUrl);

  return mqttClient;
}

export function useConnectionManager(
  clientRef: MutableRefObject<MqttClient | null>,
  setIsOnline: Dispatch<SetStateAction<boolean>>,
  setPage: Dispatch<SetStateAction<Page>>,
  setPlayers: Dispatch<SetStateAction<Set<string>>>,
  usernameRef: MutableRefObject<string>,
  setIsHost: Dispatch<SetStateAction<boolean>>,
  setDial: Dispatch<SetStateAction<number>>)
{
  let connectionLostTime: number | null = null;

  const {
    publish,
    subscribe,
    parseMessage
  } = useMqttHelper(clientRef);

  clientRef.current?.on('connect', () => {
    if (connectionLostTime) {
      const connectionLostSpan = (Date.now() - connectionLostTime) / 1000;
      debugLog(`reconnected to broker in ${connectionLostSpan}s`);
    }
    else {
      console.log("connected to broker");
    }
    
    subscribe(Topic.Broadcast);
    setIsOnline(true);
  });

  clientRef.current?.on('close', () => {
    connectionLostTime = Date.now();
  });
  
  // host & client
  function onMessage(aPaddedTopic: string, aData: any) {
    const {topic, data} = parseMessage(aPaddedTopic, aData);
    debugLog(`${topic}: ${data}`);

    switch(topic) {
      case Topic.Broadcast:
        console.log(data);
        break;
      case Topic.Join:
        onJoin(data);
        break;
      case Topic.LobbyData:
        updateLobbydata(new Set(data))
        break;
      case Topic.StartGame:
        onStart();
        break;
      case Topic.ChangeDial:
        setDial(data);
        break;
      default:
        console.log("error: unknown topic!")
    }
  }

  function broadcast(aMessage: string) {
    publish(Topic.Broadcast, aMessage)
  }
  
  function onStart() {
    setPage(Page.Game);
    subscribe(Topic.ChangeDial);
  }

  // host
  function createRoom() {
    subscribe(Topic.Join);
    subscribe(Topic.StartGame);

    setPage(Page.Lobby);
    setIsHost(true);
  }
  
  function onJoin(aUsername: string) {
    setPlayers((oldPlayers) => {
      const updatedPlayers = new Set(oldPlayers);
      updatedPlayers.add(aUsername);

      publish(Topic.LobbyData, [...updatedPlayers]);
  
      return updatedPlayers;
    });
  }

  function startGame() {
    publish(Topic.StartGame);
  }
  
  // guest
  function joinRoom(roomId: string) {
    subscribe(Topic.LobbyData);
    subscribe(Topic.StartGame);
    
    publish(Topic.Join, usernameRef.current);

    setPage(Page.Lobby);
  };
  
  function updateLobbydata(aPlayers: Set<string>) {
    const updatedPlayers = new Set(aPlayers);
    setPlayers(updatedPlayers);
  }

  function changeDial(aValue: number) {
    publish(Topic.ChangeDial, aValue);
  }

  return {
    onMessage,
    broadcast,
    createRoom,
    joinRoom,
    startGame,
    changeDial,
  };
}

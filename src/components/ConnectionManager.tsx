import { Dispatch, MutableRefObject, SetStateAction, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Topic } from '../types/Topic';
import mqtt, { MqttClient } from 'mqtt';
import { Page } from '../types/Page';
import { debugLog } from '../services/Logger';
import MqttHelper from './MqttHelper';

interface ConnectionManagerProps {
  setPage: Dispatch<SetStateAction<Page>>;
  setPlayers: Dispatch<SetStateAction<Set<string>>>;
  usernameRef: MutableRefObject<string>;
  setIsHost: Dispatch<SetStateAction<boolean>>;
  setDial: Dispatch<SetStateAction<number>>;
}

function ConnectionManager({
  setPage,
  setPlayers,
  usernameRef,
  setIsHost,
  setDial}: ConnectionManagerProps,
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

  function onConnect() {
    if (connectionLostTime) {
      const connectionLostSpan = (Date.now() - connectionLostTime) / 1000;
      debugLog(`reconnected to broker in ${connectionLostSpan}s`);
    }
    else {
      console.log("connected to broker");
    }
    
    mqttHelperRef.current.subscribe(Topic.Broadcast);
    setPage(Page.Home);
  }

  function broadcast(aMessage: string) {
    mqttHelperRef.current.publish(Topic.Broadcast, aMessage)
  }
  
  function onStart() {
    setPage(Page.Game);
    mqttHelperRef.current.subscribe(Topic.ChangeDial);
  }

  // host
  function createRoom() {
    mqttHelperRef.current.subscribe(Topic.Join);
    mqttHelperRef.current.subscribe(Topic.StartGame);

    setPage(Page.Lobby);
    setIsHost(true);
  }
  
  function onJoin(aUsername: string) {
    setPlayers((oldPlayers) => {
      const updatedPlayers = new Set(oldPlayers);
      updatedPlayers.add(aUsername);

      mqttHelperRef.current.publish(Topic.LobbyData, [...updatedPlayers]);
  
      return updatedPlayers;
    });
  }

  function startGame() {
    mqttHelperRef.current.publish(Topic.StartGame);
  }
  
  // guest
  function joinRoom(_roomId: string) {
    mqttHelperRef.current.subscribe(Topic.LobbyData);
    mqttHelperRef.current.subscribe(Topic.StartGame);
    
    mqttHelperRef.current.publish(Topic.Join, usernameRef.current);

    setPage(Page.Lobby);
  };
  
  function updateLobbydata(aPlayers: Set<string>) {
    const updatedPlayers = new Set(aPlayers);
    setPlayers(updatedPlayers);
  }

  function changeDial(aValue: number) {
    mqttHelperRef.current.publish(Topic.ChangeDial, aValue);
  }

  // Expose methods through ref forwarding
  useImperativeHandle(ref, () => ({
    broadcast,
    createRoom,
    joinRoom,
    startGame,
    changeDial,
  }));
  
  return (
    <MqttHelper
      ref={mqttHelperRef}
      mqttClient={mqttClient}  
    />
  );
}

export default forwardRef(ConnectionManager);
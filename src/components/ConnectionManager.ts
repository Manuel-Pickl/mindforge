// ConnectionManager.ts
import { Topic } from './Topic';
import mqtt, { MqttClient } from 'mqtt';

export function connect(){
  const protocoll: string = "wss";
  const address: string = "test.mosquitto.org";
  const port: string = "8081";
  const mqttUrl = `${protocoll}://${address}:${port}`;
  
  return mqtt.connect(mqttUrl);
}
const protocoll: string = "wss";
const address: string = "test.mosquitto.org";
const port: string = "8081";
export const mqttUrl = `${protocoll}://${address}:${port}`;

interface ConnectionManagerProps {
  clientRef: React.MutableRefObject<MqttClient | null>;
  setOnline: (value: boolean) => void;
  setJoinedRoom: (value: boolean) => void;
  setPlayers: (value: Set<string>) => void;
  usernameRef: React.MutableRefObject<string>;
}

export function useConnectionManager({
  clientRef,
  setOnline,
  setJoinedRoom,
  setPlayers,
  usernameRef
}: ConnectionManagerProps) {
  clientRef.current?.on('connect', () => {
    console.log("connected to broker");
    setOnline(true);
  });

  clientRef.current?.on('close', () => {
    // Handle disconnection, and optionally attempt to reconnect
    console.log('Connection closed. Reconnecting...');
    // Implement your reconnection logic here
  });
  
  clientRef.current?.on('message', onMessage);
  
  // host & client
  function onMessage(aTopic: string, aData: any) {
    console.log(
      "onMessage - topic: ", aTopic, ", data: ", JSON.parse(aData));
    switch(aTopic) {
      case Topic.Join:
        onJoin(JSON.parse(aData));
        break;
      case Topic.LobbyData:
        updateLobbydata(new Set(JSON.parse(aData)))
        break;
      default:
        console.log("error: unknown topic!")
    }
  }
  
  // host
  function createRoom() {
    clientRef.current?.subscribe(Topic.Join);
    setJoinedRoom(true);
  }
  
  function onJoin(aUsername: string) {
    // @ts-ignore
    setPlayers((prevPlayers) => {
      const updatedPlayers = new Set(prevPlayers);
      updatedPlayers.add(aUsername);
      clientRef.current?.publish(Topic.LobbyData, JSON.stringify([...updatedPlayers]));
  
      return updatedPlayers;
    });
  }
  
  
  // guest
  const joinRoom = () => {
    clientRef.current?.publish(Topic.Join, JSON.stringify(usernameRef.current));
    clientRef.current?.subscribe(Topic.LobbyData);
    setJoinedRoom(true);
  };
  
  function updateLobbydata(aPlayers: Set<string>) {
    const updatedPlayers = new Set(aPlayers);
    setPlayers(updatedPlayers);
  }

  return {
    createRoom,
    joinRoom
  };
}

// ConnectionManager.ts
import { useRef } from 'react';
import { Topic } from './Topic';
import mqtt, { MqttClient } from 'mqtt';

interface ConnectionManagerProps {
  setOnline: (value: boolean) => void;
  setJoinedRoom: (value: boolean) => void;
  setPlayers: (value: string[]) => void;
  usernameRef: React.MutableRefObject<string>;
}

export function useConnectionManager({
  setOnline,
  setJoinedRoom,
  setPlayers,
  usernameRef
}: ConnectionManagerProps) {
  const clientRef = useRef<MqttClient | null>(null);

  // const protocoll: string = "mqtt";
  const protocoll: string = "wss";
  const address: string = "test.mosquitto.org";
  const port: string = "8081";
  const mqttClient = mqtt.connect(`${protocoll}://${address}:${port}`, {
    keepalive: 10,
  });
  
  mqttClient.on('connect', () => {
    console.log("connected to: ", mqttClient)
    clientRef.current = mqttClient;
    setOnline(true);
  });
  
  mqttClient.on('close', () => {
    // Handle disconnection, and optionally attempt to reconnect
    console.log('Connection closed. Reconnecting...');
    // Implement your reconnection logic here
  });
  
  mqttClient.on('message', onMessage);
  
  // host & client
  function onMessage(aTopic: string, aData: any) {
    switch(aTopic) {
      case Topic.Join:
        onJoin(JSON.parse(aData));
        break;
      case Topic.LobbyData:
        updateLobbydata(JSON.parse(aData))
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
    setPlayers((players) => {
      const updatedPlayers = [... players, aUsername];
      clientRef.current?.publish(Topic.LobbyData, JSON.stringify(updatedPlayers));

      return updatedPlayers;
    });
  }
  
  // guest
  const joinRoom = () => {
    clientRef.current?.publish(Topic.Join, JSON.stringify(usernameRef.current));
    clientRef.current?.subscribe(Topic.LobbyData);
    setJoinedRoom(true);
  };
  
  function updateLobbydata(aPlayers: string[]) {
    setPlayers([...aPlayers]);
  }

  return {
    createRoom,
    joinRoom
  };
}

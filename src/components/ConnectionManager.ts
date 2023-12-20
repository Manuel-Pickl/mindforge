// ConnectionManager.ts
import { Topic } from './Topic';
import { MqttClient } from 'mqtt';

interface ConnectionManagerProps {
  clientRef: React.MutableRefObject<MqttClient | null>;
  setJoinedRoom: (value: boolean) => void;
  setPlayers: (value: string[]) => void;
  usernameRef: React.MutableRefObject<string>;
}

export function useConnectionManager({
  clientRef,
  setJoinedRoom,
  setPlayers,
  usernameRef
}: ConnectionManagerProps) {  
  clientRef.current?.on('close', () => {
    // Handle disconnection, and optionally attempt to reconnect
    console.log('Connection closed. Reconnecting...');
    // Implement your reconnection logic here
  });
  
  clientRef.current?.on('message', onMessage);
  
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

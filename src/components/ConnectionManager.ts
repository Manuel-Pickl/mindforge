// ConnectionManager.ts
import { useState, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { PeerData } from './Data';
import { Topic } from './Topic';

interface ConnectionManagerProps {
  username: string;
  inputValue: string;
  onData: (data: PeerData) => void;
}

export function useConnectionManager({ username, inputValue, onData }: ConnectionManagerProps)
{
  const [peer] = useState<Peer>(new Peer());
  const guestConnectionsRef = useRef<DataConnection[]>([]);

//   useEffect(() => {
//     guestConnectionsRef.current = [];
//   }, [joinedRoom]);

  function broadcast(data: PeerData, excludedConnection: DataConnection | undefined = undefined) {
    guestConnectionsRef.current
      .filter((x) => x.peer !== excludedConnection?.peer)
      .forEach((x) => x.send(data));
  }

  function initializeHost() {
    if (!peer) {
      console.error('Own Peer not initialized');
      return;
    }

    console.log(peer.id);

    peer.on('connection', (guestConnection) => {
    //   guestConnectionsRef.current = [...guestConnectionsRef.current, guestConnection];
      guestConnection.on('data', onData);
    });
  }

  function initializeGuest() {
    if (!peer) {
      console.error('Own Peer not initialized');
      return;
    }

    const hostPeerConnection = peer.connect(inputValue);
    if (!hostPeerConnection) {
      console.error('Failed connection to room');
      return;
    }

    hostPeerConnection.on('open', () => {
      guestConnectionsRef.current = [hostPeerConnection];
      hostPeerConnection.send(new PeerData(Topic.Join, username));
    });

    hostPeerConnection.on('data', onData);
  }

  return {
    peer,
    broadcast,
    initializeHost,
    initializeGuest
  };
}

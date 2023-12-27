import { Dispatch, SetStateAction, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Topic } from '../../types/Topic';
import mqtt, { MqttClient } from 'mqtt';
import { Page } from '../../types/Page';
import { debugLog } from '../../services/Logger';
import MqttHelper from '../MqttHelper';
import { Player } from '../../types/Player';
import { GameState } from '../../types/GameState';
import { SpectrumCard } from '../../types/SpectrumCard';
import { getInitialSpectrumCards } from '../../services/SpectrumCardManager';
import { solutionDuration } from '../../services/Settings';
import { getResult } from '../../services/ResultManager';
import { useGameContext } from '../Game/GameContext';
import { usePlayContext } from '../Game/Play/PlayContext';
import { usePrepareContext } from '../Game/Prepare/PrepareContext';
import { useResultContext } from '../Game/Result/ResultContext';

interface ConnectionManagerProps {
  setPage: Dispatch<SetStateAction<Page>>;
  setPlayers: Dispatch<SetStateAction<Set<Player>>>;
  setUsername: Dispatch<SetStateAction<string>>;
  spectrumCards: SpectrumCard[];
  setSpectrumCards: Dispatch<SetStateAction<SpectrumCard[]>>;
}

function ConnectionManager({
  setPage,
  setPlayers,
  setUsername,
  // spectrumCards,
  setSpectrumCards }: ConnectionManagerProps, ref: React.Ref<any>)
{
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
  const mqttHelperRef = useRef<any>();
  let connectionLostTime: number | null = null;

  const {
    setGameState
  } = useGameContext();
  const {
    /*currentPlayRound, */setCurrentPlayRound,
    /*playSpectrumCard, */setPlaySpectrumCard,
    /*roundsCount, */setRoundsCount,
    dial, setDial,
    showSolution,
  } = usePlayContext();
  const {
    setPrepareSpectrumCards,
  } = usePrepareContext();
  const {
    setResult,
  } = useResultContext();

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
    setUsername(username => {

    const {topic, data} = mqttHelperRef.current.parseMessage(aPaddedTopic, aData);
    debugLog(`${topic}: ${data}`);

    switch(topic) {
      // host
      case Topic.Join:
        onJoin(data);
        break;
      case Topic.PrepareFinished:
        onPrepareFinished(data)
        break;
      case Topic.PlayRoundFinished:
        onPlayRoundFinished(data);
        break;

        // guest
      case Topic.LobbyData:
        onLobbyData(new Set(data))
        break;
      case `${Topic.StartPrepare}/${username}`:
        onPrepareStart(data);
        break;
      case Topic.StartPlayRound:
        onPlayStart(data);
        break;
      case Topic.UpdateGlobalDial:
        onUpdateGlobalDial(data);
        break;
      case Topic.ShowPlayRoundSolution:
        showSolution();
        break;
      case Topic.StartResult:
        onStartResult(data);
        break;

      default:
        console.log("error: unknown topic!");
        console.log(topic);
    }

    return username});
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
    
    // lobbyRef.current.setIsHost(true);
    joinRoom("");
  }
  
  // host
  function onJoin(aUsername: string) {
    setPlayers(players => {

    const updatedPlayers = [...players, new Player(aUsername)];
    mqttHelperRef.current.publish(Topic.LobbyData, updatedPlayers);
    
    return players });
  }

  // host
  function startPrepare() {
    setPlayers(players => {

    const initialSpectrumCards: SpectrumCard[] = getInitialSpectrumCards(players);
    players.forEach(player => {
      const spectrumCardsForPlayer: SpectrumCard[] = initialSpectrumCards
        .filter(x => x.owner == player.username);
      mqttHelperRef.current.publish(`${Topic.StartPrepare}/${player.username}`, spectrumCardsForPlayer);
    });

    mqttHelperRef.current.subscribe(Topic.PrepareFinished);

    return players});
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
  // @ts-ignore
  function onPlayRoundFinished({ aUsername, aPlayRoundFinished }) {
    setSpectrumCards(aSpectrumCards => {
    setCurrentPlayRound(aCurrentPlayRound => {
    setRoundsCount(aRoundsCount => {
    setPlaySpectrumCard(aPlaySpectrumCard => {

    setPlayers(aPlayers => {
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
        // update spectrum cards with estimated dial
        const currentSpectrumCard: SpectrumCard | undefined = aSpectrumCards
          .find(card => card.scale[0] == aPlaySpectrumCard?.scale[0]);
        if (!currentSpectrumCard) {
          return aPlayers;
        }
        currentSpectrumCard.estimatedDial = dial;

        showPlayRoundSolution();

        const playFinished: boolean = aCurrentPlayRound >= aRoundsCount;
        if (playFinished) {
          setTimeout(() => {
            showResult();
          }, solutionDuration);
        } else {
          setTimeout(() => {
            startPlayRound(aSpectrumCards);
          }, solutionDuration);
        }
      }

      return updatedPlayers;
    });

    return aPlaySpectrumCard}); return aRoundsCount}); return aCurrentPlayRound}); return aSpectrumCards});
  }
  
  // host
  function showResult() {
    setSpectrumCards(spectrumCards => {

    const result: number = getResult(spectrumCards);
    mqttHelperRef.current.publish(Topic.StartResult, result)

    return spectrumCards});
  }
  


  function joinRoom(_roomId: string) {
    setUsername(username => {
      
    mqttHelperRef.current.publish(Topic.Join, username);
    subscribeGuest();
    setPage(Page.Lobby);

    return username});
  };
  
  function onLobbyData(aPlayers: Set<Player>) {
    const updatedPlayers = new Set(aPlayers);
    setPlayers(updatedPlayers);
  }


  function onPrepareStart(spectrumCards: SpectrumCard[]) {
    setPrepareSpectrumCards([...spectrumCards])
    setPage(Page.Game);
  }
  
  function sendPrepareFinished(aPrepareSpectrumCards: SpectrumCard[]) {
    mqttHelperRef.current.publish(Topic.PrepareFinished, aPrepareSpectrumCards);
  }

  // @ts-ignore
  function onPlayStart({ aPlaySpectrumCard, aCurrentRound, aRoundsCount }) {
    setPlaySpectrumCard(aPlaySpectrumCard);
    setCurrentPlayRound(aCurrentRound);
    setRoundsCount(aRoundsCount);
    setGameState(GameState.Play);
  }

  function updateGlobalDial(aValue: number) {
    setUsername(username => {
      
    mqttHelperRef.current.publish(Topic.UpdateGlobalDial, {
      aValue: aValue,
      aUsername: username
    });

    return username});
  }
  
  // @ts-ignore
  function onUpdateGlobalDial({ aValue, aUsername }) {
    setUsername(username => {

    const updateComesFromUserItself: boolean = username == aUsername;
    if (updateComesFromUserItself) {
      return username;
    }

    setDial(aValue);

    return username});
  }

  function sendPlayRoundFinished(aValue: boolean) {
    setUsername(username => {

    mqttHelperRef.current.publish(Topic.PlayRoundFinished, {
      aUsername: username,
      aPlayRoundFinished: aValue
    });

    return username});
  }

  function showPlayRoundSolution() {
    mqttHelperRef.current.publish(Topic.ShowPlayRoundSolution);
  }

  function onStartResult(aResult: number) {
    setResult(aResult);
    setGameState(GameState.Finish);
  }



  function subscribeGuest() {
    setUsername(username => {

    mqttHelperRef.current.subscribe(Topic.LobbyData);
    mqttHelperRef.current.subscribe(`${Topic.StartPrepare}/${username}`);
    mqttHelperRef.current.subscribe(Topic.StartPlayRound);
    mqttHelperRef.current.subscribe(Topic.UpdateGlobalDial);
    mqttHelperRef.current.subscribe(Topic.ShowPlayRoundSolution);
    mqttHelperRef.current.subscribe(Topic.StartResult);

    return username});
  }

  useImperativeHandle(ref, () => ({
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
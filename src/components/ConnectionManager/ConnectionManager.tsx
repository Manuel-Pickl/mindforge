import { ReactNode, useEffect, useRef, useState } from 'react';
import { Topic } from '../../types/enums/Topic';
import mqtt, { MqttClient } from 'mqtt';
import { Page } from '../../types/enums/Page';
import { debugLog } from '../../services/Logger';
import { Player } from '../../types/class/Player';
import { GameState } from '../../types/enums/GameState';
import { SpectrumCard } from '../../types/class/SpectrumCard';
import { getInitialSpectrumCards } from '../../services/SpectrumCardManager';
import { cardsPerPlayer, debug, debugRoom, gameSolutionDuration, prepareSplashscreenDuration } from '../../Settings';
import { getMaxPoints, getPoints } from '../../services/ResultManager';
import { useGameContext } from '../Game/GameContext';
import { usePlayContext } from '../Game/Play/PlayContext';
import { usePrepareContext } from '../Game/Prepare/PrepareContext';
import { useResultContext } from '../Game/Result/ResultContext';
import { useAppContext } from '../AppContext';
import { ConnectionManagerContext, useConnectionManagerContext } from './ConnectionManagerContext';
import MqttHelper from './MqttHelper/MqttHelper';
import { getRoomId } from '../../services/RoomManager';
import { changeAvatar } from '../../services/AvatarManager';
import { defaultValue } from '../../services/Constants';
import { useServerContext } from '../Server/ServerContext';

export const ConnectionManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mqttHelperRef = useRef<any>();

  const {
    setPage,
    setUsername,
    setPlayers,
    setRoom,
  } = useAppContext();

  const {
    setRemainingPrepareTime,
  } = useServerContext();

  // host
  function createRoom() {
    const roomId = debug ? debugRoom : getRoomId();
    setRoom(roomId);

    mqttHelperRef.current.subscribe(Topic.Join);
    mqttHelperRef.current.subscribe(Topic.ChangeAvatar);

    joinRoom(true);
  }

  // host
  function startPrepare_host() {
    setPlayers(players => {

    const prepareSpectrumCards: SpectrumCard[] = getInitialSpectrumCards(players);

    players.forEach(player => {
      const prepareSpectrumCardsForPlayer: SpectrumCard[] = prepareSpectrumCards.filter(x => x.owner == player.username);

      mqttHelperRef.current.publish(`${Topic.StartPrepare}/${player.username}`, {
        aPrepareSpectrumCards: prepareSpectrumCardsForPlayer,
        aPrepareSpectrumCount: cardsPerPlayer,
      });
    });

    mqttHelperRef.current.subscribe(Topic.PrepareFinished);

    setTimeout(() => {
      setInterval(() => {
        setRemainingPrepareTime(aRemainingPrepareTime => {
          const newRemainingPrepareTime = aRemainingPrepareTime - 1000;
          mqttHelperRef.current.publish(Topic.RemainingPrepareTime, newRemainingPrepareTime);
  
          return newRemainingPrepareTime;
        });
      }, 1000);
    }, prepareSplashscreenDuration);
    
    return players});
  }


  
  function joinRoom(aIsHost: boolean) {
    setUsername(username => {

    mqttHelperRef.current.publish(Topic.Join, {
      aUsername: username, 
      aIsHost: aIsHost,
    });

    subscribeGuest();
    setPage(Page.Lobby);

    return username});
  }

  function sendChangeAvatar(aIndexDelta: number) {
    setUsername(username => {

    mqttHelperRef.current.publish(Topic.ChangeAvatar, {
      aIndexDelta: aIndexDelta,
      aUsername: username,
    });

    return username});
  }

  function updateGlobalDial(aValue: number) {
    setUsername(username => {
      
    mqttHelperRef.current.publish(Topic.UpdateGlobalDial, {
      aValue: aValue,
      aUsername: username
    });

    return username});
  }

  function sendPrepareFinished(aPrepareSpectrumCards: SpectrumCard[]) {
    mqttHelperRef.current.publish(Topic.PrepareFinished, aPrepareSpectrumCards);
  }

  function sendPlayRoundFinished(aValue: boolean) {
    setUsername(username => {

    mqttHelperRef.current.publish(Topic.PlayRoundFinished, {
      aUsername: username,
      aPlayRoundFinished: aValue
    });

    return username});
  }

  function subscribeGuest() {
    setUsername(username => {

    mqttHelperRef.current.subscribe(Topic.LobbyData);
    mqttHelperRef.current.subscribe(`${Topic.StartPrepare}/${username}`);
    mqttHelperRef.current.subscribe(Topic.RemainingPrepareTime);
    mqttHelperRef.current.subscribe(Topic.StartPlayRound);
    mqttHelperRef.current.subscribe(Topic.UpdateGlobalDial);
    mqttHelperRef.current.subscribe(Topic.ShowPlayRoundSolution);
    mqttHelperRef.current.subscribe(Topic.StartResult);

    return username});
  }

  return (<ConnectionManagerContext.Provider value={{ mqttHelperRef, createRoom, startPrepare: startPrepare_host, joinRoom, updateGlobalDial, sendPrepareFinished, sendPlayRoundFinished, sendChangeAvatar }}>{children}</ConnectionManagerContext.Provider>);
};

function ConnectionManager()
{
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
  let connectionLostTime: number | null = null;

  const {
    mqttHelperRef,
    updateGlobalDial,
  } = useConnectionManagerContext();

  const {
    setPage,
    setUsername,
    setPlayers,
    setSpectrumCards,
  } = useAppContext();

  const {
    setGameState
  } = useGameContext();

  const {
    /*currentPlayRound, */setCurrentPlayRound,
    /*playSpectrumCard, */setPlaySpectrumCard,
    /*roundsCount, */setRoundsCount,
    /*dial, */setDial,
    showSolution,
  } = usePlayContext();
  
  const {
    startPrepare,
    setRemainingPrepareTime,
  } = usePrepareContext();
  
  const {
    setPoints,
    setMaxPoints,
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
      case Topic.ChangeAvatar:
        onChangeAvatar(data);
        break;
      case Topic.PrepareFinished:
        onPrepareFinished(data)
        break;
      case Topic.PlayRoundFinished:
        onPlayRoundFinished(data);
        break;

      // guest
      case Topic.LobbyData:
        onLobbyData(data);
        break;
      case `${Topic.StartPrepare}/${username}`:
        onPrepareStart(data);
        break;
      case Topic.RemainingPrepareTime:
        onRemainingPrepareTime(data);
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
      const millisecondsPerSecond: number = 1000;
      const connectionLostSpan = (Date.now() - connectionLostTime) / millisecondsPerSecond;
      debugLog(`reconnected to broker in ${connectionLostSpan}s`);
    }
    else {
      debugLog("connected to broker");
    }
    
    setPage(Page.Home);
  }



  // host
  // @ts-ignore
  function onJoin({ aUsername, aIsHost }) {
    setPlayers(players => {

    const updatedPlayers = [...players, new Player(aUsername, aIsHost)];
    mqttHelperRef.current.publish(Topic.LobbyData, updatedPlayers);
    
    return players });
  }

  // host
  // @ts-ignore
  function onChangeAvatar({ aIndexDelta, aUsername }) {
    setPlayers(players => {

    const updatedPlayers = changeAvatar(aIndexDelta, aUsername, players);
    mqttHelperRef.current.publish(Topic.LobbyData, updatedPlayers);
    
    return players });
  }

  // host
  function onPrepareFinished(aPrepareSpectrumCards: SpectrumCard[]) {
    const correspondingUsername = aPrepareSpectrumCards[0].owner;

    // we have to nest the update functions, because React is shit
    setSpectrumCards(spectrumCards => {
      const prepareSpectrumCardsWithClue = aPrepareSpectrumCards.filter(card => card.clue.length > 0);
      const newPlaySpectrumCards = [...spectrumCards, ...prepareSpectrumCardsWithClue];

      setPlayers((oldPlayers) => {
        const updatedPlayers = 
          Array.from(oldPlayers).map((player) =>
            player.username === correspondingUsername
              ? new Player(player.username, player.isHost, true)
              : player
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
  
      updateGlobalDial(defaultValue);
      setDial(defaultValue);

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
  // ToDo: create type for sub/pub params
  // @ts-ignore
  function onPlayRoundFinished({ aUsername, aPlayRoundFinished }) {
    setSpectrumCards(aSpectrumCards => {
    setCurrentPlayRound(aCurrentPlayRound => {
    setRoundsCount(aRoundsCount => {
    setPlaySpectrumCard(aPlaySpectrumCard => {
    setDial(aDial => {

    setPlayers(aPlayers => {
      const updatedPlayers = 
        Array.from(aPlayers).map((player) =>
          player.username === aUsername
            ? new Player(player.username, player.isHost, player.prepareFinished, aPlayRoundFinished)
            : player
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
        currentSpectrumCard.estimatedDial = aDial;

        showPlayRoundSolution();

        const playFinished: boolean = aCurrentPlayRound >= aRoundsCount;
        if (playFinished) {
          setTimeout(() => {
            showResult();
          }, gameSolutionDuration);
        } else {
          setTimeout(() => {
            startPlayRound(aSpectrumCards);
          }, gameSolutionDuration);
        }
      }

      return updatedPlayers;
    });

    return aDial}); return aPlaySpectrumCard}); return aRoundsCount}); return aCurrentPlayRound}); return [...aSpectrumCards]});
  }
  
  // host
  function showResult() {
    setSpectrumCards(spectrumCards => {

    const points: number = getPoints(spectrumCards);
    mqttHelperRef.current.publish(Topic.StartResult, {
      aPoints: points,
      aMaxPoints: getMaxPoints(spectrumCards),
    });

    return spectrumCards});
  }
  


  function onLobbyData(aPlayers: Player[]) {
    setPlayers([...aPlayers]);
  }

  // @ts-ignore
  function onPrepareStart({ aPrepareSpectrumCards, aPrepareSpectrumCount }) {
    startPrepare(aPrepareSpectrumCards, aPrepareSpectrumCount)
    setPage(Page.Game);
  }
  
  function onRemainingPrepareTime(aRemainingPrepareTime: number) {
    setRemainingPrepareTime(aRemainingPrepareTime);
  }

  // @ts-ignore
  function onPlayStart({ aPlaySpectrumCard, aCurrentRound, aRoundsCount }) {
    setPlaySpectrumCard(aPlaySpectrumCard);
    setCurrentPlayRound(aCurrentRound);
    setRoundsCount(aRoundsCount);
    setGameState(GameState.Play);
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

  function showPlayRoundSolution() {
    mqttHelperRef.current.publish(Topic.ShowPlayRoundSolution);
  }

  // @ts-ignore
  function onStartResult({ aPoints, aMaxPoints }) {
    setPoints(aPoints);
    setMaxPoints(aMaxPoints);
    setGameState(GameState.Finish);
  }
  
  return (
    <div>
      <MqttHelper
        ref={mqttHelperRef}
        mqttClient={mqttClient}  
      />
    </div>
  );
}

export default ConnectionManager;
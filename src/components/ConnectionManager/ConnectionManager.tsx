import { ReactNode, useEffect, useRef, useState } from 'react';
import { Topic } from '../../types/enums/Topic';
import mqtt, { MqttClient } from 'mqtt';
import { Page } from '../../types/enums/Page';
import { debugLog } from '../../services/Logger';
import { Player } from '../../types/class/Player';
import { GameState } from '../../types/enums/GameState';
import { SpectrumCard } from '../../types/class/SpectrumCard';
import { getInitialSpectrumCards } from '../../services/SpectrumCardManager';
import { cardsPerPlayer, debugRoom, gameSolutionDuration, prepareSplashscreenDuration } from '../../Settings';
import { getMaxPoints, getPoints } from '../../services/ResultManager';
import { useGameContext } from '../Game/GameContext';
import { usePlayContext } from '../Game/Play/PlayContext';
import { usePrepareContext } from '../Game/Prepare/PrepareContext';
import { useResultContext } from '../Game/Result/ResultContext';
import { useAppContext } from '../AppContext';
import { ConnectionManagerContext, useConnectionManagerContext } from './ConnectionManagerContext';
import MqttHelper from './MqttHelper/MqttHelper';
import { changeAvatar } from '../../services/AvatarManager';
import { defaultValue, joinWaitingTime } from '../../services/Constants';
import { useServerContext } from '../Server/ServerContext';

export const ConnectionManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mqttHelperRef = useRef<any>();
  const [_joined, setJoined] = useState<boolean>(false);
  const [_remainingPrepareTimeInterval, setRemainingPrepareTimeInterval] = useState<NodeJS.Timeout>();

  const {
    setUsername,
    setPlayers,
    setRoom,
  } = useAppContext();

  const {
    setCurrentPlayRound,
    setDial,
  } = usePlayContext();

  const {
    setSpectrumCards,
  } = useAppContext();

  const {
    setRemainingPrepareTime,
  } = useServerContext();

  // host
  function createRoom() {
    // const roomId = debug ? debugRoom : getRoomId();
    const roomId = debugRoom;
    setRoom(roomId);

    mqttHelperRef.current.subscribe(Topic.Join);
    mqttHelperRef.current.subscribe(Topic.ChangeAvatar);

    joinRoom(true);
  }

  // host
  function startPrepare_host() {
    //#region variable wrapper
    setPlayers(players => {
    setRemainingPrepareTime(remainingPrepareTime => {
    //#endregion variable wrapper
    const prepareSpectrumCards: SpectrumCard[] = getInitialSpectrumCards(players);

    players.forEach(player => {
      const prepareSpectrumCardsForPlayer: SpectrumCard[] = prepareSpectrumCards.filter(x => x.owner == player.username);

      mqttHelperRef.current.publish(`${Topic.StartPrepare}/${player.username}`, {
        aPrepareSpectrumCards: prepareSpectrumCardsForPlayer,
        aPrepareSpectrumCount: cardsPerPlayer,
      });
    });

    mqttHelperRef.current.subscribe(Topic.preparedCard);

    setTimeout(() => {
      setRemainingPrepareTimeInterval(
          setInterval(() => {
            const prepareTimeUp: boolean = remainingPrepareTime <= 0;
            if (prepareTimeUp) {
              startPlay();
            }

            console.log(remainingPrepareTime)
            remainingPrepareTime -= 1;
            mqttHelperRef.current.publish(Topic.RemainingPrepareTime, remainingPrepareTime);
        
        }, 1000)
      );
    }, prepareSplashscreenDuration * 1000);
    //#region variable wrapper
    return remainingPrepareTime});
    return players});
    //#endregion variable wrapper
  }


  
  function joinRoom(aIsHost: boolean) {
    setUsername(username => {

    mqttHelperRef.current.subscribe(`${Topic.JoinSuccess}/${username}`);
    mqttHelperRef.current.subscribe(Topic.LobbyData);
    mqttHelperRef.current.subscribe(`${Topic.StartPrepare}/${username}`);
    mqttHelperRef.current.subscribe(Topic.RemainingPrepareTime);
    mqttHelperRef.current.subscribe(Topic.StartPlayRound);
    mqttHelperRef.current.subscribe(Topic.UpdateGlobalDial);
    mqttHelperRef.current.subscribe(Topic.ShowPlayRoundSolution);
    mqttHelperRef.current.subscribe(Topic.StartResult);
  
    mqttHelperRef.current.publish(Topic.Join, {
      aUsername: username, 
      aIsHost: aIsHost,
    });

    setTimeout(() => {
      setJoined(aJoined => {
        if (!aJoined) {
          alert("Der Raum existiert nicht oder du kannst nicht mehr beitreten")
        }
      return aJoined})
    }, joinWaitingTime * 1000);

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

  function sendPreparedCard(aPreparedCard: SpectrumCard) {
    mqttHelperRef.current.publish(Topic.preparedCard, aPreparedCard);
  }

  function sendPlayRoundFinished(aValue: boolean) {
    setUsername(username => {

    mqttHelperRef.current.publish(Topic.PlayRoundFinished, {
      aUsername: username,
      aPlayRoundFinished: aValue
    });

    return username});
  }

  // host
  function startPlay() {
    //#region variable wrapper
    setSpectrumCards(spectrumCards => {;
    setRemainingPrepareTimeInterval(remainingPrepareTimeInterval => {
    //#endregion variable wrapper
    clearInterval(remainingPrepareTimeInterval);

    mqttHelperRef.current.subscribe(Topic.PlayRoundFinished);
    
    const shuffledSpectrumCards: SpectrumCard[] =
      spectrumCards.sort(() => Math.random() - 0.5);
    setSpectrumCards(shuffledSpectrumCards);

    startPlayRound(shuffledSpectrumCards);
    //#region variable wrapper
    return remainingPrepareTimeInterval; });
    return spectrumCards; });
    //#endregion variable wrapper
  }

    // host
    function startPlayRound(aSpectrumCards: SpectrumCard[]) {
      //#region variable wrapper
      setCurrentPlayRound(currentPlayRound => {
      setPlayers(players => {
      //#endregion variable wrapper
      players.forEach(player => {
        player.playRoundFinished = false;
      })
    
      updateGlobalDial(defaultValue);
      setDial(defaultValue);
  
      const playSpectrumCard: SpectrumCard = aSpectrumCards[currentPlayRound];
      currentPlayRound++;

      mqttHelperRef.current.publish(Topic.StartPlayRound, {
        aPlaySpectrumCard: playSpectrumCard,
        aCurrentRound: currentPlayRound,
        aRoundsCount: aSpectrumCards.length,
      });
      //#region variable wrapper
      return players; });
      return currentPlayRound; });
      //#endregion variable wrapper
    }

  return (<ConnectionManagerContext.Provider value={{ setJoined, mqttHelperRef, createRoom, startPrepare: startPrepare_host, joinRoom, updateGlobalDial, sendPreparedCard: sendPreparedCard, sendPlayRoundFinished, sendChangeAvatar, startPlay, startPlayRound }}>{children}</ConnectionManagerContext.Provider>);
};

function ConnectionManager()
{
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
  let connectionLostTime: number | null = null;

  const {
    setJoined,
    mqttHelperRef,
    startPlay,
    startPlayRound,
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
    setCurrentPlayRound,
    setPlaySpectrumCard,
    setRoundsCount,
    setDial,
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
    // const mqttClient: MqttClient = mqtt.connect(mqttUrl);
    const mqttClient: MqttClient = mqtt.connect("ws://localhost:9001");

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
      case Topic.preparedCard:
        onPreparedCard(data)
        break;
      case Topic.PlayRoundFinished:
        onPlayRoundFinished(data);
        break;

      // guest
      case `${Topic.JoinSuccess}/${username}`:
        onJoinSuccess();
        break;
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
        throw new Error(`unknown topic:\n${topic}`);
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

    mqttHelperRef.current.publish(`${Topic.JoinSuccess}/${aUsername}`);

    setTimeout(() => {
      const updatedPlayers = [...players, new Player(aUsername, aIsHost)];
      mqttHelperRef.current.publish(Topic.LobbyData, updatedPlayers);
    }, 1000);
    
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
  function onPreparedCard(aPreparedCard: SpectrumCard) 
  {
    //#region variable wrapper
    setPlayers(players => {
    setRemainingPrepareTime(remainingPrepareTime => {
    setSpectrumCards(spectrumCards => {
    //#endregion variable wrapper
    spectrumCards.push(aPreparedCard);

    const currentCardsCount: number = spectrumCards.length;
    const maxCards: number = cardsPerPlayer * players.length;
    
    const prepareFinished: boolean = currentCardsCount == maxCards;
    if (prepareFinished) {
      startPlay();
    }
  
    //#region variable wrapper
    return spectrumCards; });
    return remainingPrepareTime; });
    return players; });
    //#endregion variable wrapper
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
          }, gameSolutionDuration * 1000);
        } else {
          setTimeout(() => {
            startPlayRound(aSpectrumCards);
          }, gameSolutionDuration * 1000);
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
  


  function onJoinSuccess() {
    setJoined(true);
    setPage(Page.Lobby);
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
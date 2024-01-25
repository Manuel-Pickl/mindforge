import { ReactNode, useEffect, useRef, useState } from 'react';
import { Topic } from '../../types/enums/Topic';
import mqtt, { MqttClient } from 'mqtt';
import { Page } from '../../types/enums/Page';
import { debugLog } from '../../services/Logger';
import { Player } from '../../types/class/Player';
import { GameState } from '../../types/enums/GameState';
import { SpectrumCard } from '../../types/class/SpectrumCard';
import { getInitialSpectrumCards } from '../../services/SpectrumCardManager';
import { cardsPerPlayer, debugRoom, gameSolutionDuration, mqttUrl, prepareSplashscreenDuration } from '../../Settings';
import { getMaxPoints, getTotalPoints } from '../../services/ResultManager';
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
import '../../services/Extensions/ArrayExtensions';
import { UserTouch } from '../../types/class/UserTouch';
import { useDialContext } from '../Dial/DialContext';

export const ConnectionManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mqttHelperRef = useRef<any>();
  const [_joined, setJoined] = useState<boolean>(false);

  const {
    setUsername,
    setRoom,
  } = useAppContext();

  const {
    setPlayers,
    setSpectrumCards,
    setCurrentPlayRound,
    setRemainingPrepareTime,
    setRemainingPrepareTimeInterval,
  } = useServerContext();

  // host
  function createRoom_host()
  {
    // const roomId = debug ? debugRoom : getRoomId();
    const roomId = debugRoom;
    setRoom(roomId);

    mqttHelperRef.current.subscribe(Topic.Join);
    mqttHelperRef.current.subscribe(Topic.ChangeAvatar);

    joinRoom(true);
  }

  // host
  function startPrepare_host()
  {
    //#region variable wrapper
    setPlayers(players => {
    setRemainingPrepareTime(remainingPrepareTime => {
    //#endregion
    const prepareSpectrumCards: SpectrumCard[] = getInitialSpectrumCards(players);

    players.forEach(player =>
    {
      const prepareSpectrumCardsForPlayer: SpectrumCard[] = prepareSpectrumCards.filter(x => x.owner == player.username);
      const playerTopic: string = `${Topic.StartPrepare}/${player.username}`;
      mqttHelperRef.current.publish(playerTopic, prepareSpectrumCardsForPlayer);
    });

    mqttHelperRef.current.subscribe(Topic.preparedCard);

    setTimeout(() =>
    {
      setRemainingPrepareTimeInterval(
          setInterval(() => 
          {
            const prepareTimeUp: boolean = remainingPrepareTime <= 0;
            if (prepareTimeUp)
            {
              startPlay_host();
            }

            remainingPrepareTime -= 1;
            mqttHelperRef.current.publish(Topic.RemainingPrepareTime, remainingPrepareTime);
        
        }, 1000)
      );
    }, prepareSplashscreenDuration * 1000);
    //#region variable wrapper
    return remainingPrepareTime});
    return players});
    //#endregion
  }


  
  function joinRoom(aIsHost: boolean)
  {
    //#region variable wrapper
    setUsername(username => {
    //#endregion
    mqttHelperRef.current.subscribe(`${Topic.JoinSuccess}/${username}`);
    mqttHelperRef.current.subscribe(Topic.Players);
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
    //#region variable wrapper
    return username});
    //#endregion
  }

  function sendChangeAvatar(aIndexDelta: number)
  {
    //#region variable wrapper
    setUsername(username => {
    //#endregion
    mqttHelperRef.current.publish(Topic.ChangeAvatar, {
      aIndexDelta: aIndexDelta,
      aUsername: username,
    });
    //#region variable wrapper
    return username});
    //#endregion
  }

  function updateGlobalDial(
    aValue: number,
    aUsername: string = "",
    x: number = -1,
    y: number = -1)
  {
    mqttHelperRef.current.publish(Topic.UpdateGlobalDial, {
      aValue: aValue,
      aUsername: aUsername,
      x: x,
      y: y,
    });
  }

  function sendPreparedCard(aPreparedCard: SpectrumCard) {
    mqttHelperRef.current.publish(Topic.preparedCard, aPreparedCard);
  }

  function sendPlayRoundFinished(aValue: boolean)
  {
    //#region variable wrapper
    setUsername(username => {
    //#endregion
    mqttHelperRef.current.publish(Topic.PlayRoundFinished, {
      aUsername: username,
      aPlayRoundFinished: aValue
    });
    //#region variable wrapper
    return username});
    //#endregion
  }

  // host
  function startPlay_host()
  {
    //#region variable wrapper
    setSpectrumCards(spectrumCards => {;
    setRemainingPrepareTimeInterval(remainingPrepareTimeInterval => {
    //#endregion
    clearInterval(remainingPrepareTimeInterval);

    mqttHelperRef.current.subscribe(Topic.PlayRoundFinished);
    
    const shuffledSpectrumCards: SpectrumCard[] =
      spectrumCards.sort(() => Math.random() - 0.5);
    setSpectrumCards(shuffledSpectrumCards);

    startPlayRound_host(shuffledSpectrumCards);
    //#region variable wrapper
    return remainingPrepareTimeInterval; });
    return spectrumCards; });
    //#endregion variable wrapper
  }

  // host
  function startPlayRound_host(aSpectrumCards: SpectrumCard[]) {
    //#region variable wrapper
    setCurrentPlayRound(currentPlayRound => {
    setPlayers(players => {
    //#endregion
    const playSpectrumCard: SpectrumCard = aSpectrumCards[currentPlayRound];
    currentPlayRound++;

    players.forEach(player =>
    {
      player.playRoundFinished = false;
    });
    
    const currentCardOwner: Player = players.first(player => player.username == playSpectrumCard.owner);
    currentCardOwner.playRoundFinished = true;
    
    mqttHelperRef.current.publish(Topic.Players, players);
  
    mqttHelperRef.current.publish(Topic.StartPlayRound, {
      aPlaySpectrumCard: playSpectrumCard,
      aCurrentRound: currentPlayRound,
      aRoundsCount: aSpectrumCards.length,
    });

    updateGlobalDial(defaultValue);
    //#region variable wrapper
    return players; });
    return currentPlayRound; });
    //#endregion
  }

  return (<ConnectionManagerContext.Provider value={{ setJoined, mqttHelperRef, createRoom: createRoom_host, startPrepare: startPrepare_host, joinRoom, updateGlobalDial, sendPreparedCard: sendPreparedCard, sendPlayRoundFinished, sendChangeAvatar, startPlay_host: startPlay_host, startPlayRound_host: startPlayRound_host }}>{children}</ConnectionManagerContext.Provider>);
};

function ConnectionManager()
{
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
  let connectionLostTime: number | null = null;

  const {
    setJoined,
    mqttHelperRef,
    startPlay_host,
    startPlayRound_host,
  } = useConnectionManagerContext();

  const {
    setPlayers,
    setSpectrumCards,
    setCurrentPlayRound,
  } = useServerContext();

  const {
    setPage,
    setUsername,
    setPlayers: setClientPlayers,
  } = useAppContext();

  const {
    setGameState
  } = useGameContext();

    
  const {
    startPrepare,
    setRemainingPrepareTime,
  } = usePrepareContext();
  
  const {
    setPlaySpectrumCard,
    setDial,
    startPlayRound,
    showSolution,
  } = usePlayContext();

  const {
    showUserTouch,
  } = useDialContext();
  
  const {
    setPoints,
    setMaxPoints,
  } = useResultContext();

  useEffect(() =>
  {
    const mqttClient: MqttClient = mqtt.connect(mqttUrl);

    mqttClient.on('message', onMessage);
    mqttClient.on('connect', onConnect);
    mqttClient.on('close', onClose);

    setMqttClient(mqttClient);
  }, []);
  
  // host & client
  function onMessage(aPaddedTopic: string, aData: any)
  {
    //#region variable wrapper
    setUsername(username => {
    //#endregion
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
      case Topic.Players:
        onLobbyData(data);
        break;
      case `${Topic.StartPrepare}/${username}`:
        onPrepareStart(data);
        break;
      case Topic.RemainingPrepareTime:
        onRemainingPrepareTime(data);
        break;
      case Topic.StartPlayRound:
        onStartPlayRound(data);
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
    //#region variable wrapper
    return username});
    //#endregion
  }

  function onConnect()
  {
    //#region variable wrapper
    setPage(page => {
    //#endregion
    if (connectionLostTime)
    {
      const millisecondsPerSecond: number = 1000;
      const connectionLostSpan = (Date.now() - connectionLostTime) / millisecondsPerSecond;
      debugLog(`reconnected to broker in ${connectionLostSpan}s`);
    }
    else
    {
      debugLog("connected to broker");
    }
    
    if (page == Page.Offline)
    {
      page = Page.Start;
    }
    //#region variable wrapper
    return page});
    //#endregion
  }

  function onClose()
  {
    connectionLostTime = Date.now();
  }



  // host
  // @ts-ignore
  function onJoin({ aUsername, aIsHost })
  {
    //#region variable wrapper
    setPlayers(players => {
    //#endregion
    mqttHelperRef.current.publish(`${Topic.JoinSuccess}/${aUsername}`);

    // ToDo: we need a delay for slow connection
    // better solution -> solve via custom topic
    players.push(new Player(aUsername, aIsHost));
    mqttHelperRef.current.publish(Topic.Players, players);
    //#region variable wrapper
    return players });
    //#endregion
  }

  // host
  // @ts-ignore
  function onChangeAvatar({ aIndexDelta, aUsername })
  {
    //#region variable wrapper
    setPlayers(players => {
    //#endregion
    players = changeAvatar(aIndexDelta, aUsername, players);
    mqttHelperRef.current.publish(Topic.Players, players);
    //#region variable wrapper
    return players });
    //#endregion
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
    if (prepareFinished)
    {
      startPlay_host();
    }
    //#region variable wrapper
    return spectrumCards; });
    return remainingPrepareTime; });
    return players; });
    //#endregion
  }

  // host
  // ToDo: create type for sub/pub params
  // @ts-ignore
  function onPlayRoundFinished({ aUsername, aPlayRoundFinished })
  {
    //#region variable wrapper
    setPlayers(players => {
    //#endregion
    players
      .first(player => player.username == aUsername)    
      .playRoundFinished = aPlayRoundFinished;

    mqttHelperRef.current.publish(Topic.Players, players);

    const allPlayersPlayRoundFinished =
      players.every(player => player.playRoundFinished);
    if (allPlayersPlayRoundFinished)
    {
      finishPlayRound();
    }
    //#region variable wrapper
    return players });
    //#endregion
  }
  
  function finishPlayRound()
  {
    //#region variable wrapper
    setSpectrumCards(spectrumCards => {
    setPlaySpectrumCard(playSpectrumCard => {
    setDial(dial => {
    setCurrentPlayRound(currentPlayRound => {
    //#endregion
    const currentSpectrumCard: SpectrumCard = spectrumCards
      .first(card => card.scale[0] == playSpectrumCard?.scale[0]);
    currentSpectrumCard.estimatedDial = dial;

    showPlayRoundSolution();

    const playFinished: boolean = currentPlayRound >= spectrumCards.length;
    setTimeout(() =>
    {
      if (playFinished)
      {
        showResult_host();
      } 
      else
      {
        startPlayRound_host(spectrumCards);
      }
    }, gameSolutionDuration * 1000);
    //#region variable wrapper
    return currentPlayRound });
    return dial });
    return playSpectrumCard });
    return spectrumCards });
    //#endregion
  }

  // host
  function showResult_host()
  {
    //#region variable wrapper
    setSpectrumCards(spectrumCards => {
    //#endregion
    const totalPoints: number = getTotalPoints(spectrumCards);
    mqttHelperRef.current.publish(Topic.StartResult, {
      aPoints: totalPoints,
      aMaxPoints: getMaxPoints(spectrumCards),
    });
    //#region variable wrapper
    return spectrumCards});
    //#endregion
  }
  


  function onJoinSuccess()
  {
    setJoined(true);
    setPage(Page.Lobby);
  }

  function onLobbyData(aPlayers: Player[])
  {
    setClientPlayers(aPlayers);
  }

  function onPrepareStart(aPrepareSpectrumCards: SpectrumCard[])
  {
    startPrepare(aPrepareSpectrumCards)
    setPage(Page.Game);
  }
  
  function onRemainingPrepareTime(aRemainingPrepareTime: number)
  {
    setRemainingPrepareTime(aRemainingPrepareTime);
  }

  // @ts-ignore
  function onStartPlayRound({ aPlaySpectrumCard, aCurrentRound, aRoundsCount })
  {
    startPlayRound(aPlaySpectrumCard, aCurrentRound, aRoundsCount)
    setGameState(GameState.Play);
  }

  // @ts-ignore
  function onUpdateGlobalDial({ aValue, aUsername, x, y })
  {
    //#region variable wrapper
    setUsername(username => {
    //#endregion
    const updateComesFromUserItself: boolean = username == aUsername;
    if (updateComesFromUserItself)
    {
      return username;
    }

    setDial(aValue);
    showUserTouch(new UserTouch(aUsername, x, y));
    //#region variable wrapper
    return username});
    //#endregion
  }

  function showPlayRoundSolution()
  {
    mqttHelperRef.current.publish(Topic.ShowPlayRoundSolution);
  }

  // @ts-ignore
  function onStartResult({ aPoints, aMaxPoints })
  {
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
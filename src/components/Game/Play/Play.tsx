import { ReactNode, useEffect, useState } from "react";
import { SpectrumCard } from "../../../types/class/SpectrumCard";
import { gameSplashscreenDuration } from "../../../Settings";
import { PlayContext, usePlayContext } from "./PlayContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import Dial from "../../Dial/Dial";
import { defaultValue } from "../../../services/Constants";
import PlaySplashscreen from "./PlaySplashscreen/PlaySplashscreen";
import { useAppContext } from "../../AppContext";
import "./Play.scss";
import UnfinishedPlayers from "./UnfinishedPlayers/UnfinishedPlayers";

export const PlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentPlayRound, setCurrentPlayRound] = useState<number>(0);
    const [roundsCount, setRoundsCount] = useState<number>(-1);
    const [playSpectrumCard, setPlaySpectrumCard] = useState<SpectrumCard | null>(null);
    const [dial, setDial] = useState<number>(defaultValue);
    const [solutionVisible, setSolutionVisible] = useState<boolean>(false);
    const [readyButtonDisabled, setReadyButtonDisabled] = useState<boolean>(false);
    const [splashscreenVisible, setSplashscreenVisible] = useState<boolean>(true)

    function startPlayRound(
        aPlaySpectrumCard: SpectrumCard,
        aCurrentRound: number,
        aRoundsCount: number)
    {
        setPlaySpectrumCard(aPlaySpectrumCard);
        setCurrentPlayRound(aCurrentRound);
        setRoundsCount(aRoundsCount);

        setReadyButtonDisabled(false);
        setSolutionVisible(false);
        
        setSplashscreenVisible(true);
        setTimeout(() => {
            setSplashscreenVisible(false)
        }, gameSplashscreenDuration * 1000);
    }

    function showSolution() {
        setSolutionVisible(true);
    }

    return (<PlayContext.Provider value={{ currentPlayRound, setCurrentPlayRound, roundsCount, setRoundsCount, playSpectrumCard, setPlaySpectrumCard, dial, setDial, solutionVisible, setSolutionVisible, startPlayRound, showSolution, readyButtonDisabled, setReadyButtonDisabled, splashscreenVisible, setSplashscreenVisible }}>{children}</PlayContext.Provider>);
};

function Play()
{
    const [unfinishedPlayersVisible, setUnfinishedPlayersVisible] = useState<boolean>(false);

    const {
        currentPlayRound,
        roundsCount,
        playSpectrumCard,
        solutionVisible,
        dial, setDial,
        readyButtonDisabled, setReadyButtonDisabled,
        splashscreenVisible,

    } = usePlayContext();
    
    const {
        sendPlayRoundFinished,
        updateGlobalDial,
    } = useConnectionManagerContext();

    const {
        username,
        players,
    } = useAppContext();
    
    useEffect(() => {
        setReadyButtonDisabled(false);
        sendPlayRoundFinished(false);
    }, [dial]);

    function onDialChange(aValue: number) {
        if (solutionVisible) {
            return;
        }

        setDial(aValue);
        updateGlobalDial(aValue, username);
    }

    function onFinishedClick() {
        setReadyButtonDisabled(true);
        sendPlayRoundFinished(true);
    }
    
    return (
        <div className="playComponent">
            {splashscreenVisible ? (
                <PlaySplashscreen
                    username={playSpectrumCard?.owner}
                    currentPlayRound={currentPlayRound}
                    roundsCount={roundsCount}
                />
            ) : (
            <>
                <div className="info">{playSpectrumCard?.owner}'s Hinweis</div>
                <div className="clue">{playSpectrumCard?.clue}</div>
                
                <Dial
                    hideHand={false}
                    solutionVisible={solutionVisible}
                    solution={playSpectrumCard?.realDial ?? 0}
                    onDialChange={onDialChange}
                    dial={dial}
                    scale={playSpectrumCard?.scale ?? ["",""]}
                />
            
                <div className="buttons">
                    <button
                        className="finishedPlayers"
                        onClick={() => setUnfinishedPlayersVisible(true)}
                    >
                        Spieler
                    </button>
                    <button
                        disabled={readyButtonDisabled}
                        onClick={onFinishedClick}
                    >
                        Fertig
                    </button>
                </div>

                {unfinishedPlayersVisible &&
                    <UnfinishedPlayers
                        setUnfinishedPlayersVisible={setUnfinishedPlayersVisible}
                        players={players}
                    />
                }
            </>
            )}
        </div>
    );
}

export default Play;
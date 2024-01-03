import { ReactNode, useEffect, useState } from "react";
import { SpectrumCard } from "../../../types/class/SpectrumCard";
import { gameSplashscreenDuration } from "../../../Settings";
import { PlayContext, usePlayContext } from "./PlayContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import Dial from "../../Dial/Dial";
import { defaultValue } from "../../../services/Constants";
import { useAppContext } from "../../AppContext";
import "./Play.scss";
import AvatarBubble from "../../AvatarBubble/AvatarBubble";

export const PlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentPlayRound, setCurrentPlayRound] = useState<number>(0);
    const [roundsCount, setRoundsCount] = useState<number>(-1);
    const [playSpectrumCard, setPlaySpectrumCard] = useState<SpectrumCard | null>(null);
    const [dial, setDial] = useState<number>(defaultValue);
    const [solutionVisible, setSolutionVisible] = useState<boolean>(false);
    
    function startPlayRound(
        aPlaySpectrumCard: SpectrumCard,
        aCurrentRound: number,
        aRoundsCount: number)
    {
        setPlaySpectrumCard(aPlaySpectrumCard);
        setCurrentPlayRound(aCurrentRound);
        setRoundsCount(aRoundsCount);
    }

    function showSolution() {
        setSolutionVisible(true);
    }

    return (<PlayContext.Provider value={{ currentPlayRound, setCurrentPlayRound, roundsCount, setRoundsCount, playSpectrumCard, setPlaySpectrumCard, dial, setDial, solutionVisible, setSolutionVisible, startPlayRound, showSolution }}>{children}</PlayContext.Provider>);
};

function Play()
{
    const [readyButtonDisabled, setReadyButtonDisabled] = useState<boolean>(false);
    const [splashscreenVisible, setSplashscreenVisible] = useState<boolean>(true)

    const {
        currentPlayRound,
        roundsCount,
        playSpectrumCard,
        solutionVisible, setSolutionVisible,
        dial, setDial,
    } = usePlayContext();
    
    const {
        sendPlayRoundFinished,
        updateGlobalDial,
    } = useConnectionManagerContext();

    const {
        getPlayer,
    } = useAppContext();

    useEffect(() => {
        setReadyButtonDisabled(false);
        setSolutionVisible(false);
        
        setSplashscreenVisible(true);
        setTimeout(() => {
            setSplashscreenVisible(false)
        }, gameSplashscreenDuration * 1000);
    }, [playSpectrumCard]);

    useEffect(() => {
        setReadyButtonDisabled(false);
        sendPlayRoundFinished(false);
    }, [dial]);

    function onDialChange(aValue: number) {
        if (solutionVisible) {
            return;
        }

        setDial(aValue);
        updateGlobalDial(aValue);
    }

    function onFinishedClick() {
        setReadyButtonDisabled(true);
        sendPlayRoundFinished(true);
    }

    return (
        <div className="playComponent">
            {splashscreenVisible ? (
            <>
                <div className="avatar">
                    <AvatarBubble
                        avatar={getPlayer(playSpectrumCard?.owner)?.avatar}
                        isHost={getPlayer(playSpectrumCard?.owner)?.isHost ?? false}
                    />
                </div>

                <div className="round">
                    {`Runde ${currentPlayRound} von ${roundsCount}`}
                </div>

                <div className="info">
                    {`${playSpectrumCard?.owner}'s Hinweis ist...`}
                </div>
            </>
            ) : (
            <div>
                <h2>Hinweis: {playSpectrumCard?.clue}</h2>
                
                <Dial
                    hideHand={false}
                    solutionVisible={solutionVisible}
                    solution={playSpectrumCard?.realDial ?? 0}
                    onDialChange={onDialChange}
                    dial={dial}
                    scale={playSpectrumCard?.scale ?? ["",""]}
                />
            
                <br/><br/><br/><br/>

                <button
                    disabled={readyButtonDisabled}
                    onClick={onFinishedClick}
                >
                    Fertig
                </button>
            </div>
            )}
        </div>
    );
}

export default Play;
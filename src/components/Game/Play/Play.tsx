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
import Scroll from "../../Scroll/Scroll";
import Card from "../../Card/Card";

export const PlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentPlayRound, setCurrentPlayRound] = useState<number>(0);
    const [roundsCount, setRoundsCount] = useState<number>(-1);
    const [playSpectrumCard, setPlaySpectrumCard] = useState<SpectrumCard | null>(null);
    const [dial, setDial] = useState<number>(defaultValue);
    const [solutionVisible, setSolutionVisible] = useState<boolean>(false);
    const [readyButtonDisabled, setReadyButtonDisabled] = useState<boolean>(false);
    const [splashscreenVisible, setSplashscreenVisible] = useState<boolean>(true)
    const [unfinishedPlayersVisible, setUnfinishedPlayersVisible] = useState<boolean>(false);

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
        setUnfinishedPlayersVisible(false);
    }

    return (<PlayContext.Provider value={{ currentPlayRound, setCurrentPlayRound, roundsCount, setRoundsCount, playSpectrumCard, setPlaySpectrumCard, dial, setDial, solutionVisible, setSolutionVisible, startPlayRound, showSolution, readyButtonDisabled, setReadyButtonDisabled, splashscreenVisible, setSplashscreenVisible, unfinishedPlayersVisible, setUnfinishedPlayersVisible }}>{children}</PlayContext.Provider>);
};

function Play()
{
    const {
        currentPlayRound,
        roundsCount,
        playSpectrumCard,
        solutionVisible,
        dial, setDial,
        readyButtonDisabled, setReadyButtonDisabled,
        splashscreenVisible,
        unfinishedPlayersVisible, setUnfinishedPlayersVisible,
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

        if (isCardOwner()) {
            return;
        }

        sendPlayRoundFinished(false);
    }, [dial]);

    function isCardOwner(): boolean {
        const isCardOwner: boolean = username == playSpectrumCard?.owner;

        return isCardOwner;
    }

    function onDialChange(aValue: number, x: number, y: number) {
        if (solutionVisible) {
            return;
        }

        if (isCardOwner()) {
            return;
        }

        setDial(aValue);
        updateGlobalDial(aValue, username, x, y);
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
                <Card>
                    <div>
                        {playSpectrumCard?.owner}'s Hinweis
                    </div>

                    <h3>
                        {playSpectrumCard?.clue}
                    </h3>
                </Card>
                
                <Dial
                    hideHand={false}
                    solutionVisible={solutionVisible}
                    solution={playSpectrumCard?.realDial ?? 0}
                    onDialChange={onDialChange}
                    dial={dial}
                    scale={playSpectrumCard?.scale ?? ["",""]}
                />
            
                {isCardOwner() &&
                    <div className="outline">
                        Das ist deine Karte, nichts verraten!
                    </div>
                }

                <div className="buttons">
                    <Scroll
                        onClick={() => setUnfinishedPlayersVisible(true)}
                    >
                        Spieler
                    </Scroll>
                    
                    {!isCardOwner() &&
                        <Scroll
                            disabled={readyButtonDisabled}
                            onClick={onFinishedClick}
                        >
                            Fertig
                        </Scroll>
                    }
                </div>

                {unfinishedPlayersVisible &&
                    <UnfinishedPlayers
                        setUnfinishedPlayersVisible={setUnfinishedPlayersVisible}
                        players={players}
                        cardOwner={playSpectrumCard?.owner}
                    />
                }
            </>
            )}
        </div>
    );
}

export default Play;
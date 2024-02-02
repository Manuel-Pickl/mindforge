import { ReactNode, useState } from "react";
import { ResultContext, useResultContext } from "./ResultContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import { useAppContext } from "../../AppContext";
import Scroll from "../../Scroll/Scroll";
import { useNavigate } from "react-router-dom";
import { Player } from "../../../types/class/Player";
import "./Result.scss";
import "./ResultAnimations.scss";

export const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [points, setPoints] = useState<number>(0);
    const [maxPoints, setMaxPoints] = useState<number>(0);
  
    return (<ResultContext.Provider value={{ points, setPoints, maxPoints, setMaxPoints }}>{children}</ResultContext.Provider>);
};

function Result()
{
    const navigate = useNavigate();
    
    const {
        points,
        maxPoints,
    } = useResultContext();

    const {
    } = useAppContext();

    const {
        startPrepare,
    } = useConnectionManagerContext();

    function getPointPercentage(): number {
        const pointsPercentage: number = points/maxPoints * 100;

        return pointsPercentage;
    }

    function getColor(): string {
        if (getPointPercentage() >= 90) {
            return "#FFD700";
        }
        if (getPointPercentage() >= 70) {
            return "green";
        }
        if (getPointPercentage() >= 50) {
            return "blue";
        }
        if (getPointPercentage() >= 30) {
            return "red";
        }
        return "red";
    }

    function getGrade(): string {
        if (getPointPercentage() >= 90) {
            return "SS";
        }
        if (getPointPercentage() >= 70) {
            return "A";
        }
        if (getPointPercentage() >= 50) {
            return "B";
        }
        if (getPointPercentage() >= 30) {
            return "C";
        }
        return "F";
    }

    return (
        <div className="resultComponent">
            <h2>Ergebnis</h2>

            <div className="result">
                <div className="left">
                    <div
                        className="bucket"
                        style={{
                            "--height": `${getPointPercentage()}%`,
                            "--background-color": getColor()
                        } as React.CSSProperties}
                    >
                        <div className="content" />
                    </div>
                </div>

                <div className="right">
                    <div className="grade">
                        {getGrade()}
                    </div>
                    <div className="points">
                        <div>
                            Punkte
                        </div>
                        <div>
                            {points} / {maxPoints}
                        </div>
                    </div>
                </div>

            </div>
            
            <div className="buttons">
                {getPlayer()?.isHost &&
                    <Scroll
                        className="replay"
                        // disabled={getPlayer()?.isHost}
                        onClick={() => startPrepare}
                    >
                        Nochmal Spielen
                    </Scroll>
                }

                <Scroll
                    className="end"
                    onClick={() => navigate("/")}
                >
                    Beenden
                </Scroll>
            </div>
        </div>
    );
}

export default Result;
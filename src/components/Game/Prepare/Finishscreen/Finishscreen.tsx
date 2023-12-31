import Counter from "../Counter/Counter";
import "./Finishscreen.scss";

interface FinishscreenProps {
    startTime: number;
    remainingTime: number;
}
  
function Finishscreen({
    startTime,
    remainingTime }: FinishscreenProps)
{
    return (
        <div className="finishscreenComponent">
            <div className="counterWrapper">
                <Counter
                    startTime={startTime}
                    remainingTime={remainingTime}
                />
            </div>

            <div className="info">
                Warten bis andere Spieler fertig sind...
            </div>
        </div>
    );
}

export default Finishscreen;
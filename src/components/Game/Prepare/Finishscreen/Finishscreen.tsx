import { prepareTime } from "../../../../Settings";
import Counter from "../../../Counter/Counter";
import { usePrepareContext } from "../PrepareContext";
import "./Finishscreen.scss";
  
function Finishscreen()
{
    const {
        remainingPrepareTime,
    } = usePrepareContext();

    return (
        <div className="finishscreenComponent">
            <div className="counterWrapper">
                <Counter
                    startTime={prepareTime}
                    remainingTime={remainingPrepareTime}
                />
            </div>

            <div className="outline">
                Warten bis andere Spieler fertig sind...
            </div>
        </div>
    );
}

export default Finishscreen;
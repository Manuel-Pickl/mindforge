import { usernameMaxLength } from "../../../Settings";
import { useAppContext } from "../../AppContext";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import Scroll from "../../Scroll/Scroll";
import "./Create.scss";
import "./CreateAnimation.scss";

function Create() {    
    const {
        username, setUsername,
    } = useAppContext();

    const {
        createRoom_host,
    } = useConnectionManagerContext();

    function createDisabled() {
        const nameIsEmpty: boolean = username.trim().length == 0;
        if (nameIsEmpty) {
            return true;
        }

        return false;
    }

    return (
        <div className="createComponent">
            <div className="input username">
                <input
                    type="text"
                    placeholder="Dein Name"
                    maxLength={usernameMaxLength}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            
            <Scroll
                className="scroll"
                disabled={createDisabled()}
                onClick={createRoom_host}
            >
                Raum erstellen
            </Scroll>

            <div className="input placeholder"><input/></div>
        </div>
    );
}

export default Create;
import { useAppContext } from "../../AppContext";
import { usernameMaxLength } from "../../../Settings";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import "./Create.scss";
import Scroll from "../../Scroll/Scroll";

function Create()
{
    const {
        username, setUsername,
        room,
    } = useAppContext();

    const {
        createRoom,
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
            <div className="input">
                <input
                    type="text"
                    placeholder="Dein Name"
                    maxLength={usernameMaxLength}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="input"
                data-disabled={true}
            >
                <input 
                    placeholder="Raum"
                    value={room}
                />
                <div className="disabled" />
            </div>

            <Scroll
                disabled={createDisabled()}
                onClick={createRoom}
            >
                Raum Erstellen
            </Scroll>
        </div>
    );
}

export default Create;
import { useAppContext } from "../../../AppContext";
import { usernameMaxLength } from "../../../services/Settings";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";
import "./Create.scss";

function Create()
{
    const {
        username, setUsername,
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
                Dein Name
                <input
                    type="text"
                    placeholder="Benutzer"
                    maxLength={usernameMaxLength}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            
            <button
                className="actionButton"
                disabled={createDisabled()}
                onClick={createRoom}
            >
                Raum Erstellen
            </button>
        </div>
    );
}

export default Create;
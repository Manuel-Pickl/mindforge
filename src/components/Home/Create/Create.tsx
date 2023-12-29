import { useAppContext } from "../../../AppContext";
import { usernameMaxLength } from "../../../services/Settings";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";

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
        <>
            <div>
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
                className="action"
                disabled={createDisabled()}
                onClick={createRoom}
            >
                Raum Erstellen
            </button>
        </>
    );
}

export default Create;
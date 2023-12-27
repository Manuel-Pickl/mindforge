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

    return (
        <>
            <input
                type="text"
                placeholder="Benutzer"
                maxLength={usernameMaxLength}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={createRoom}>Raum erstellen</button>
        </>
    );
}

export default Create;
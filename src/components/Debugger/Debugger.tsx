import "./Debugger.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faHouse, faCouch, faStar } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { websiteUrl } from "../../Settings";

function Debugger() {
    const [debuggerVisible, setDebuggerVisible] = useState<boolean>(true);

    function homeCreate() {
        document.location = `${websiteUrl}/?tab=create`;
    }

    function homeJoin() {
        document.location = `${websiteUrl}/?room=ZZZZ`;
    }

    function lobbyJoin() {
        document.location = `${websiteUrl}/lobby/?action=join&room=ZZZZ`;
    }
    
    function lobbyCreate() {
        document.location = `${websiteUrl}/lobby/?action=create&room=ZZZZ`;
    }

    return (
        <div
            className="debuggerComponent"
            style={{ translate: debuggerVisible ? "" : "0 -100%" }}
            >
            <div className="content">
                <div
                    className="link"
                    onClick={homeCreate}
                >
                    <FontAwesomeIcon icon={faHouse}/>
                    <FontAwesomeIcon icon={faStar}/>
                </div>
                
                <div
                    className="link"
                    onClick={homeJoin}
                >
                    <FontAwesomeIcon icon={faHouse}/>
                </div>

                <div
                    className="link"
                    onClick={lobbyCreate}
                >
                    <FontAwesomeIcon icon={faCouch}/>
                    <FontAwesomeIcon icon={faStar}/>
                </div>

                <div
                    className="link"
                    onClick={lobbyJoin}
                >
                    <FontAwesomeIcon icon={faCouch}/>
                </div>
            </div>

            <div className="chevron">
                <FontAwesomeIcon
                    className="closeIcon"
                    style={{ transform: debuggerVisible ? "" : "rotateX(180deg)" }}
                    icon={faChevronUp}
                    onClick={() => setDebuggerVisible(!debuggerVisible)}
                />
            </div>
        </div>
    );
}

export default Debugger;
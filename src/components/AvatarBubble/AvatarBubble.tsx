import addAvatar from "../../assets/avatars/add.png";
import "./AvatarBubble.scss";

interface AvatarBubbleProps {
    avatar: string | undefined;
    isHost?: boolean;
    isShareButton?: boolean;
    username?: string;
    fontSize?: string;
    share?: () => void;
  }
  
function AvatarBubble({
    avatar,
    isHost,
    isShareButton = false,
    username = "",
    fontSize = "1rem",
    share = () => {},
}: AvatarBubbleProps) {
    function onClick() {
        if (avatar) {

        } else if (isShareButton) {
            share();
        }
    }

    function getAvatarImage(): JSX.Element | undefined {
        if (avatar) {
            return <img src={avatar} alt={avatar}/>;
        }
        
        if (isShareButton) {
            return <img src={addAvatar} alt={addAvatar} className="add" />;
        }
    }

    return (
        <div
            className={"avatarBubbleComponent"}
            style={{"--font-size": fontSize } as React.CSSProperties}
        >
            {isHost &&
                <div className="host">
                    Host
                </div>
            }

            <div
                className="avatar"
                onClick={onClick}
            >
                {getAvatarImage()}
            </div>

            <div className="outline">
                {username}
            </div>
        </div>
    )
}

export default AvatarBubble;
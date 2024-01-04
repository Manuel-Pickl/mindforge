import addAvatar from "../../assets/avatars/add.svg";
import "./AvatarBubble.scss";

interface AvatarBubbleProps {
    avatar: string | undefined;
    isHost: boolean;
    isShareButton?: boolean;
    username?: string;
  }
  
function AvatarBubble({
    avatar,
    isHost,
    isShareButton = false,
    username = "" }: AvatarBubbleProps)
{
    function onClick() {
        // if (avatar) { } else 
        if (isShareButton) {
            alert("share");
        }
    }

    function getAvatarImage(): JSX.Element | undefined {
        if (avatar) {
            return <img src={avatar} alt={avatar}/>;
        }
        
        if (isShareButton) {
            return <img src={addAvatar} alt={addAvatar}/>;
        }
    }

    return (
       <div className={"avatarBubbleComponent"}>
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

            <div className="username">
                {username}
            </div>
        </div>
    )
}

export default AvatarBubble;
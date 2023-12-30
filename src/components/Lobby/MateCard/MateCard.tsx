import { Avatar } from "../../../types/Avatar";
import "./MateCard.scss";

interface MateCardProps {
    username: string;
    avatar: Avatar;
    isHost: boolean;
    isShareButton: boolean;
  }
  
function MateCard({
    username,
    avatar,
    isHost,
    isShareButton }: MateCardProps)
{
    function onMateCardClick() {
        // if (avatar) { } else 
        if (isShareButton) {
            alert("share");
        }
    }

    function getStatusClass(): string {
        const statusClass: string = username == ""
            ? "disabled" : "";

        return statusClass;
    }

    function getAvatarImage(): JSX.Element | undefined {
        if (avatar) {
            return <img src={`avatars/${avatar}.svg`}/>;
        } else if (isShareButton) {
            return <img src="avatars/add.svg"/>;
        }
    }

    return (
       <div className={"mateCardComponent"}>
            {isHost &&
                <div className="host" >Host</div>
            }

            <div
                className={`avatar ${getStatusClass}`}
                onClick={onMateCardClick}
            >
                {getAvatarImage()}
            </div>
            
            <div className="username">{username}</div>
        </div>
    )
}

export default MateCard;
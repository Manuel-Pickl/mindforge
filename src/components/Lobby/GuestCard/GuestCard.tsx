import { Avatar } from "../../../types/Avatar";
import "./GuestCard.scss";

interface GuestCardProps {
    username: string;
    avatar: Avatar;
    isShareButton: boolean;
  }
  
function GuestCard({
    username,
    avatar,
    isShareButton }: GuestCardProps)
{
    function onGuestCardClick() {
        if (avatar) {
            console.log("user");
        } else if (isShareButton) {
            console.log("share");
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
       <div className={"GuestCardComponent"}>
            <div
                className={`avatar ${getStatusClass}`}
                onClick={onGuestCardClick}
            >
                {getAvatarImage()}
            </div>
            <div className="username">{username}</div>
        </div>
    )
}

export default GuestCard;
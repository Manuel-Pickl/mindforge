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
    // function share() {
    //     if (!isShareButton) {
    //         return;
    //     }

    //     // share invite
    // }

    function getStatusClass(): string {
        const statusClass: string = username == ""
            ? "disabled" : "";

        return statusClass;
    }

    function getAvatarImage(): JSX.Element | null {
        if (avatar) {
            return <img src={`avatars/${avatar}.svg`}/>;
        } else if (isShareButton) {
            return <img src="avatars/add.svg"/>;
        } else {
            return null;
        }
    }

    return (
       <div className={"GuestCardComponent"}>
            <div className={`avatar ${getStatusClass()}`}>
                {getAvatarImage()}
            </div>
            <div className="username">{username}</div>
        </div>
    )
}

export default GuestCard;
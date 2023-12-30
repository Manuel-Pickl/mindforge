import { Avatar } from "../../../types/Avatar";
import "./PlayerCard.scss";
import arrowLeft from "../../../assets/icons/arrow_left.svg";
import arrowRight from "../../../assets/icons/arrow_right.svg";
import { useConnectionManagerContext } from "../../ConnectionManager/ConnectionManagerContext";

interface PlayerCardProps {
    username: string;
    avatar: Avatar | undefined;
  }
  
function PlayerCard({
    username,
    avatar }: PlayerCardProps)
{
    const {
        sendChangeAvatar,
    } = useConnectionManagerContext();

    return (
       <div className={"playerCardComponent"}>
            <div className={"avatar"}>
                <img src={`avatars/${avatar}.svg`} alt={avatar}/>
                <img src={arrowLeft} alt={arrowLeft}
                    className="arrow left" 
                    onClick={() => sendChangeAvatar(-1)}
                />
                <img src={arrowRight} alt={arrowRight}
                    className="arrow right"
                    onClick={() => sendChangeAvatar(1)}
                />
            </div>
            <div className="username">{username}</div>
        </div>
    )
}

export default PlayerCard;
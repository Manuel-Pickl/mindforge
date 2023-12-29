import { Avatar } from "../../../types/Avatar";
import "./PlayerCard.scss";

interface PlayerCardProps {
    username: string;
    avatar: Avatar;
  }
  
function PlayerCard({
    username,
    avatar }: PlayerCardProps)
{
    return (
       <div className={"playerCardComponent"}>
            <div className={"avatar"}>
                <img src={`avatars/${avatar}.svg`}/>
            </div>
            <div className="username">{username}</div>
        </div>
    )
}

export default PlayerCard;
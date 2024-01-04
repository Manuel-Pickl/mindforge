import { useAppContext } from "../../../AppContext";
import AvatarBubble from "../../../AvatarBubble/AvatarBubble";
import "./PlaySplashscreen.scss";

interface PlaySplashscreenProps {
    username: string | undefined;
    currentPlayRound: number;
    roundsCount: number;
}

function PlaySplashscreen({
    username,
    currentPlayRound,
    roundsCount }: PlaySplashscreenProps)
{
    
    const {
        getPlayer,
    } = useAppContext();
    
    return (
        <div className="playSplashscreenComponent">
            <div className="avatar">
                <AvatarBubble
                    avatar={getPlayer(username)?.avatar}
                    isHost={getPlayer(username)?.isHost ?? false}
                />
            </div>

            <div className="round">
                {`Runde ${currentPlayRound} von ${roundsCount}`}
            </div>

            <div className="info">
                {`${username}'s Hinweis ist...`}
            </div>
        </div>
    );
}

export default PlaySplashscreen;
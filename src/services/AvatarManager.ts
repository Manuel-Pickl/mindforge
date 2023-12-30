import { Avatar } from "../types/Avatar";
import { Player } from "../types/Player";

const avatars = [
    Avatar.Giraffe,
    Avatar.Hippo,
    Avatar.Lion,
    Avatar.Panda,
    Avatar.Seal,
    Avatar.Sloth,
    Avatar.Tiger,
];

export function changeAvatar(
    aIndexDelta: number,
    aUsername: string,
    aPlayers: Player[]): Player[]
{
    const player: Player | undefined = aPlayers
        .find(player => player.username == aUsername);
    if (!player) {
        return aPlayers;
    }

    const currentAvatarIndex = avatars.indexOf(player.avatar);
    const newAvatarIndex = (currentAvatarIndex + aIndexDelta + avatars.length) % (avatars.length);
    
    player.avatar = avatars[newAvatarIndex];
    return aPlayers;
};
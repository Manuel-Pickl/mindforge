import { Avatar } from "../types/enums/Avatar";
import { Player } from "../types/class/Player";
import "./Extensions/ArrayExtensions";

const avatars = [
    Avatar.Giraffe,
    Avatar.Hippo,
    Avatar.Lion,
    Avatar.Panda,
    Avatar.Seal,
    Avatar.Sloth,
    Avatar.Tiger,
];

export function getRandomAvatar(): Avatar {
    const randomAvatarIndex: number = Math.floor(Math.random() * avatars.length);
    const randomAvatar: Avatar = avatars[randomAvatarIndex];

    return randomAvatar;
}

export function changeAvatar(
    aIndexDelta: number,
    aUsername: string,
    aPlayers: Player[]): Player[]
{
    const player: Player = aPlayers
        .first(player => player.username == aUsername);

    const currentAvatarIndex = avatars.indexOf(player.avatar);
    const newAvatarIndex = (currentAvatarIndex + aIndexDelta + avatars.length) % (avatars.length);
    
    player.avatar = avatars[newAvatarIndex];
    return aPlayers;
};
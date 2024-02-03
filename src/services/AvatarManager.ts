import { Player } from "../types/class/Player";
import "./Extensions/ArrayExtensions";

// avatars
import giraffe from "../assets/avatars/giraffe.png";
import hippo from "../assets/avatars/hippo.png";
import lion from "../assets/avatars/red panda.png";
import panda from "../assets/avatars/panda.png";
import seal from "../assets/avatars/bear.png";
import sloth from "../assets/avatars/wolf.png";
import tiger from "../assets/avatars/tiger.png";
import elephant from "../assets/avatars/elephant.png";

const avatars = [
    giraffe,
    hippo,
    lion,
    panda,
    seal,
    sloth,
    tiger,
    elephant,
];

export function getRandomAvatar(): string {
    const randomAvatarIndex: number = Math.floor(Math.random() * avatars.length);
    const randomAvatar: string = avatars[randomAvatarIndex];

    return randomAvatar;
}

export function changeAvatar(
    aIndexDelta: number,
    aUsername: string,
    aPlayers: Player[]): Player[]
{
    const player: Player = aPlayers.first(player => player.username == aUsername);

    const currentAvatarIndex = avatars.indexOf(player.avatar);
    const newAvatarIndex = (currentAvatarIndex + aIndexDelta + avatars.length) % (avatars.length);
    
    player.avatar = avatars[newAvatarIndex];
    return aPlayers;
};
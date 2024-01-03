import { Player } from "../types/class/Player";
import "./Extensions/ArrayExtensions";

// avatars
import giraffe from "../assets/avatars/giraffe.svg";
import hippo from "../assets/avatars/hippo.svg";
import lion from "../assets/avatars/lion.svg";
import panda from "../assets/avatars/panda.svg";
import seal from "../assets/avatars/seal.svg";
import sloth from "../assets/avatars/sloth.svg";
import tiger from "../assets/avatars/tiger.svg";


const avatars = [
    giraffe,
    hippo,
    lion,
    panda,
    seal,
    sloth,
    tiger,
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
    const player: Player = aPlayers
        .first(player => player.username == aUsername);

    const currentAvatarIndex = avatars.indexOf(player.avatar);
    const newAvatarIndex = (currentAvatarIndex + aIndexDelta + avatars.length) % (avatars.length);
    
    player.avatar = avatars[newAvatarIndex];
    return aPlayers;
};
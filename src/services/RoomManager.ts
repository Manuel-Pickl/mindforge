import { roomIdMaxLength } from "../Settings";

export function getRoomId(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let roomId = "";
    
    for (let i = 0; i < roomIdMaxLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        roomId += characters.charAt(randomIndex);
    }

    return roomId;
}

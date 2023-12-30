import { Player } from "../types/Player";
import { SpectrumCard } from "../types/SpectrumCard"
import { maxDialhandValue } from "./Settings";

const cardsPerPlayer: number = 1;

export function getInitialSpectrumCards(players: Player[]): SpectrumCard[] {
    const spectrumCards: SpectrumCard[] = [];

    const scalesCount: number = players.length * cardsPerPlayer;
    const scales: [string, string][] = getRandomScales(scalesCount);
    let scaleIndex: number = 0;

    players.forEach(player => {
        for (let j: number = 0; j < cardsPerPlayer; j++) {
            const spectrumCard: SpectrumCard = new SpectrumCard(
                player.username,
                scales[scaleIndex],
                getRandomDial(),
            )
            spectrumCards.push(spectrumCard);
            scaleIndex++;
        }
    });

    return spectrumCards;
}

function getRandomScales(count: number): [string, string][] {
    const shuffledScales: [string, string][] =
        allScales.sort(() => Math.random() - 0.5);
    return shuffledScales.slice(0, count);
}

function getRandomDial(): number {
    // number between 0 and max dialhand value
    const randomNumber = Math.floor(Math.random() * maxDialhandValue);
    return randomNumber;
}

const allScales: [string, string][] = [
    ["Kalt", "Heiß"],
    ["Weich", "Hart"],
    ["Hässlich", "Schön"],
    ["Wertlos", "Wertvoll"],
    ["Laut", "Leise"],
    ["Unnötig", "Nützlich"],
]
import { Player } from "../types/Player";
import { SpectrumCard } from "../types/SpectrumCard"

const cardsPerPlayer: number = 2;

export function getInitialSpectrumCards(players: Set<Player>): SpectrumCard[] {
    const spectrumCards: SpectrumCard[] = [];

    const scalesCount: number = players.size * cardsPerPlayer;
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
    const numberBetweenZeroAndHundred = Math.floor(Math.random() * 100);
    return numberBetweenZeroAndHundred;
}

const allScales: [string, string][] = [
    ["Kalt", "Heiß"],
    ["Weich", "Hart"],
    ["Hässlich", "Schön"],
    ["Wertlos", "Wertvoll"],
    ["Laut", "Leise"],
    ["Unnötig", "Nützlich"],
]
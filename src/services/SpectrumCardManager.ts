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

function getRandomScales(_count: number): [string, string][] {
    const scales: [string, string][] = [];

    // shuffle scales & substr count
    scales.push(["Kalt", "Heiß"]);
    scales.push(["Weich", "Hart"]);
    scales.push(["Hässlich", "Schön"]);
    scales.push(["Wertlos", "Wertvoll"]);
    scales.push(["Laut", "Leise"]);
    scales.push(["Unnötig", "Nützlich"]);

    return scales;
}

function getRandomDial(): number {
    const numberBetweenZeroAndHundred = Math.floor(Math.random() * 100);
    return numberBetweenZeroAndHundred;
}
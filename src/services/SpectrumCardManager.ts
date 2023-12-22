import { Player } from "../types/Player";
import { SpectrumCard } from "../types/SpectrumCard"

const cardsPerPlayer: number = 2;

export function getInitialSpectrumCards(players: Set<Player>): SpectrumCard[] {
    const spectrumCards: SpectrumCard[] = [];

    const scalesCount: number = players.size * cardsPerPlayer;
    const scales: [string, string][] = getRandomScales(scalesCount);

    players.forEach((player, i) => {
        for (let j: number = 0; j < cardsPerPlayer; j++) {
            // @ts-ignore
            const scaleIndex: number = (i * cardsPerPlayer) + j;
            const spectrumCard: SpectrumCard = new SpectrumCard(
                scales[scaleIndex],
                getRandomDial(),
                player.username
            )
            spectrumCards.push(spectrumCard);
        }
    });

    return spectrumCards;
}

function getRandomScales(count: number): [string, string][] {
    const scales: [string, string][] = [];

    // shuffle scales & substr count
    scales.push(["Kalt", "Heiß"]);
    scales.push(["Weich", "Hart"]);
    scales.push(["Hässlich", "Schön"]);
    scales.push(["Wertlos", "Wertvoll"]);

    return scales;
}

function getRandomDial(): number {
    const numberBetweenZeroAndHundred = Math.floor(Math.random() * 100);
    return numberBetweenZeroAndHundred;
}
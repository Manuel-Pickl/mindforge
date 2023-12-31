import { Player } from "../types/Player";
import { SpectrumCard } from "../types/SpectrumCard"
import { maxDialhandValue } from "./Settings";

const cardsPerPlayer: number = 2;
const skipsPerCard: number = 1;

export function getInitialSpectrumCards(players: Player[]): SpectrumCard[] {
    const spectrumCards: SpectrumCard[] = [];

    const cardsToPlayCount: number = players.length * cardsPerPlayer;
    const cardsToSkipCount: number = players.length * cardsPerPlayer * skipsPerCard;
    const scalesCount: number = cardsToPlayCount + cardsToSkipCount;
    const scales: [string, string][] = getRandomScales(scalesCount);
    console.log(scales)
    let scaleIndex: number = 0;

    players.forEach(player => {
        for (let j: number = 0; j < cardsPerPlayer + cardsPerPlayer * skipsPerCard; j++) {
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
    ["Leise", "Laut"],
    ["Unnötig", "Nützlich"],
    ["Unterbewerteter Job", "Überbewerteter Job"],
    ["Unterbezahlter Job", "Überbezahlter Job"],
    ["Schlechte Kindheitsserie", "Gute Kindheitsserie"],
    ["Unzurecht berühmt", "Zurecht berühmt"],
    ["Bösewicht", "Vorbild"],
    ["Stinkt", "Duftet"],
    ["Riecht stark und schlecht", "Riecht start aber gut"],
    ["Farblos", "Farbenfroh"],
    ["Rund", "Eckig"],
    ["Haarlos", "Haarig"],
    ["Jung", "Alt"],
    ["Freiwillig", "Gezwungen"],
    ["Komisch zu besitzen", "Normal zu besitzen"],
    ["Unsexy Tier", "Sexy Tier"],
    ["Unsexy Emoji", "Sexy Emoji"],
    ["Sexspielzeug", "Normaler Gegenstand"],
    ["Unverlässlich", "Verlässlich"],
    ["Gefährlich", "Sicher"],
    ["Macht man aus Lust", "Macht man aus Liebe"],
    ["Essen bei dem man sich drecking macht", "Essen bei dem man sauber bleibt"],
    ["Ungesundes Essen", "Gesundes Essen"],
    ["Schwer zu merken", "Leicht zu merken"],
    ["Schmeckt schlecht", "Schmeckt gut"],
    ["Nische", "Mainstream"],
    ["Für Kinder", "Für Erwachsene"],
    ["Keine Kunst", "Kunst"],
    ["Verschieden", "Ähnlich"],
    ["Immer spät", "Immer Pünktlich"],
    ["Vertikal", "Horizontal"],
    ["Langweilig", "Lustig"],
    ["Komische Begrüßung", "Normale Begrüßung"],
    ["Unsinnige Phobie", "Angemessene Phobie"],
    ["Schwer drauf zu sitzen", "Leicht darauf zu sitzen"],
    ["Nicht umarmbar", "Umarmbar"],
    ["Schlechtes Mundgefühl", "Gutes Mundgefühl"],
    ["Schlecht beim Sex", "Gut beim Sex"],
    ["Besser kalt", "Besser warm"],
    ["Unterbewerteter Buchstabe", "Überbewerteter Buchstabe"],
]
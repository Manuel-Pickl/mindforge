import { inProduction, skipsPerCard } from "../Settings";
import { Player } from "../types/class/Player";
import { SpectrumCard } from "../types/class/SpectrumCard"
import { maxDialhandValue } from "./Constants";

export function getInitialSpectrumCards(players: Player[]): SpectrumCard[] {
    const playerCount: number = players.length;

    const spectrumCards: SpectrumCard[] = [];
    const scalesCount: number = getTotalCards(playerCount);
    const scales: [string, string][] = getRandomScales(scalesCount);
    
    let scaleIndex: number = 0;

    players.forEach(player => {
        for (let i: number = 0; i < getTotalCardsPerPlayer(playerCount); i++) {
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

export function getPlayCardsPerPlayer(playerCount: number): number {
    // for better testing
    if (!inProduction) {
        return 1;
    }

    switch (playerCount) {
        case 2: return 3;   // 6 cards overall
        case 3: return 3;   // 9 cards overall
        case 4: return 2;   // 8 cards overall
        case 5: return 2;   // 10 cards overall
        case 6: return 2;   // 12 cards overall
        case 7: return 1;   // 7 cards overall
        case 8: return 1;   // 8 cards overall
        default:
            throw new Error(`playerCount ${playerCount} is not allowed!`);
    }
}

function getSkipCardsPerPlayer(playerCount: number): number {
    const skipCardsPerPlayer: number = 
        getPlayCardsPerPlayer(playerCount) * skipsPerCard;
    
    return skipCardsPerPlayer;
}

function getTotalCardsPerPlayer(playerCount: number): number {
    const totalCardsPerPlayer: number = 
        getPlayCardsPerPlayer(playerCount) + getSkipCardsPerPlayer(playerCount);

    return totalCardsPerPlayer;
}

export function getTotalPlayerCards(playerCount: number): number {
    const totalPlayCards: number = getPlayCardsPerPlayer(playerCount) * playerCount;

    return totalPlayCards;
}

function getTotalCards(playerCount: number): number {
    const totalCards: number = getTotalCardsPerPlayer(playerCount) * playerCount;

    return totalCards;
}

function getRandomScales(count: number): [string, string][] {
    const shuffledScales: [string, string][] =
        allScales.sort(() => Math.random() - 0.5);
    return shuffledScales.slice(0, count);
}

function getRandomDial(): number {
    // number between 0 and max 180
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
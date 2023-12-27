import { SpectrumCard } from "../types/SpectrumCard";

export function getResult(aSpectrumCards: SpectrumCard[]): number {
    let points: number = 0;
    
    aSpectrumCards.forEach(card => {
        const difference: number = Math.abs(card.realDial - card.estimatedDial);
        const differencePercentage: number = difference / 100;
        points += getPoints(differencePercentage);
    });

    return points;
}

export function getPoints(differencePercentage: number): number {
    let points: number = 0;

    if      (differencePercentage < 10) points = 4;
    else if (differencePercentage < 20) points = 3;
    else if (differencePercentage < 30) points = 2;
    else if (differencePercentage < 40) points = 1;

    return points;
}
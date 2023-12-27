import { SpectrumCard } from "../types/SpectrumCard";

export function getPoints(aSpectrumCards: SpectrumCard[]): number {
    let points: number = 0;
    
    aSpectrumCards.forEach(card => {
        const difference: number = Math.abs(card.realDial - card.estimatedDial);
        const differencePercentage: number = difference / 100;
        points += differenceToPoints(differencePercentage);
    });

    return points;
}

export function getMaxPoints(aSpectrumCards: SpectrumCard[]): number {
    const maxPoints: number = aSpectrumCards.length * 4;
    return maxPoints;
}

export function differenceToPoints(differencePercentage: number): number {
    let points: number = 0;

    if      (differencePercentage < 0.1) points = 4;
    else if (differencePercentage < 0.2) points = 3;
    else if (differencePercentage < 0.3) points = 2;
    else if (differencePercentage < 0.4) points = 1;

    return points;
}
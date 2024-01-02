import { solutionSectorDegrees } from "../Settings";
import { SpectrumCard } from "../types/class/SpectrumCard";
import { Sector } from "../types/enums/Sector";

const feelGoodMargin: number = 0;
const pointsFromSector: {[key in Sector]: number} = {
    [Sector.None]: 0,
    [Sector.OnePointLeft]: 1,
    [Sector.OnePointRight]: 1,
    [Sector.TwoPointsLeft]: 2,
    [Sector.TwoPointsRight]: 2,
    [Sector.ThreePoints]: 3,
};

export function getHitSector(
    estimatedDial: number,
    realDial: number
): Sector {
    const onePointBorderLeft: number = realDial - solutionSectorDegrees * 2.5 - feelGoodMargin;
    const twoPointsBorderLeft: number = realDial - solutionSectorDegrees * 1.5 - feelGoodMargin;
    const threePointsBorderLeft: number = realDial - solutionSectorDegrees * 0.5;
    const threePointsBorderRight: number = realDial + solutionSectorDegrees * 0.5;
    const twoPointsBorderRight: number = realDial + solutionSectorDegrees * 1.5 + feelGoodMargin;
    const onePointBorderRight: number = realDial + solutionSectorDegrees * 2.5 + feelGoodMargin;
    
    const onePointLeftHit: boolean =
        estimatedDial >= onePointBorderLeft
        && estimatedDial < twoPointsBorderLeft;
    const twoPointsLeftHit: boolean =
        estimatedDial >= twoPointsBorderLeft
        && estimatedDial < threePointsBorderLeft;
    const threePointsHit: boolean =
        estimatedDial >= threePointsBorderLeft
        && estimatedDial <= threePointsBorderRight;
    const twoPointsRightHit: boolean =
        estimatedDial > threePointsBorderRight
        && estimatedDial <= twoPointsBorderRight;
    const onePointRightHit: boolean =
        estimatedDial > twoPointsBorderRight
        && estimatedDial <= onePointBorderRight;

    let hitSector: Sector;
    if (onePointLeftHit)        hitSector = Sector.OnePointLeft;
    else if (twoPointsLeftHit)  hitSector = Sector.TwoPointsLeft;
    else if (threePointsHit)    hitSector = Sector.ThreePoints;
    else if (twoPointsRightHit) hitSector = Sector.TwoPointsRight;
    else if (onePointRightHit)  hitSector = Sector.OnePointRight;
    else                        hitSector = Sector.None;

    return hitSector;
}

export function getSinglePoints(aCard: SpectrumCard): number {
    const hitSector: Sector = getHitSector(aCard.estimatedDial, aCard.realDial);
    const points: number = pointsFromSector[hitSector];

    return points;
}

export function getTotalPoints(aSpectrumCards: SpectrumCard[]): number {
    let points: number = 0;
    
    aSpectrumCards.forEach(card =>
    {
        points += getSinglePoints(card);
    });

    return points;
}

export function getMaxPoints(aSpectrumCards: SpectrumCard[]): number {
    const maxPoints: number = aSpectrumCards.length * 3;
    return maxPoints;
}

export function differenceToPoints(aDifference: number): number {
    let points: number = 0;

    if      (aDifference < 0.1) points = 4;
    else if (aDifference < 0.2) points = 3;
    else if (aDifference < 0.3) points = 2;
    else if (aDifference < 0.4) points = 1;

    return points;
}
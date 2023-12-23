export class SpectrumCard {
    owner: string;
    scale: [string, string];
    realDial: number;
    estimatedDial: number;
    clue: string;

    constructor(
        owner: string,
        scale: [string, string],
        realDial: number,
        estimatedDial: number = 50,
        clue: string = "")
    {
        this.owner = owner;
        this.scale = scale;
        this.realDial = realDial;
        this.estimatedDial = estimatedDial;
        this.clue = clue;
    }
}
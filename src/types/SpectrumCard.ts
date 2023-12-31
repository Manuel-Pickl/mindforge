export class SpectrumCard {
    owner: string;
    scale: [string, string];
    realDial: number;
    estimatedDial: number;
    clue: string;
    skipped: boolean;

    constructor(
        owner: string,
        scale: [string, string],
        realDial: number,
        estimatedDial: number = 50,
        clue: string = "",
        skipped: boolean = true)
    {
        this.owner = owner;
        this.scale = scale;
        this.realDial = realDial;
        this.estimatedDial = estimatedDial;
        this.clue = clue;
        this.skipped = skipped;
    }
}
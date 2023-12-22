export class SpectrumCard {
    scale: [string, string];
    dial: number;
    owner: string;
    clue: string;

    constructor(scale: [string, string], dial: number, owner: string, clue: string = "") {
        this.scale = scale;
        this.dial = dial;
        this.owner = owner;
        this.clue = clue;
    }
}
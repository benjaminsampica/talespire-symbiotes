export default class Effect {
    constructor(name, roundDuration) {
        this.name = name;
        this.roundDuration = roundDuration;
    }

    static list() {
        return [
            new Effect('Cat`s Grace', this.minutesToRounds(1)),
            new Effect('Bless', this.minutesToRounds(1)),
            new Effect('Blink', this.minutesToRounds(1)),
            new Effect('Effect', this.minutesToRounds(1)),
            new Effect('Enlarge/Reduce', this.minutesToRounds(1)),
            new Effect('Expeditious Retreat', this.minutesToRounds(10)),
            new Effect('Guidance', this.minutesToRounds(1)),
            new Effect('Haste', this.minutesToRounds(1)),
            new Effect('Heroism', this.minutesToRounds(1)),
            new Effect('Faerie Fire', this.minutesToRounds(1)),
            new Effect('Feather Fall', this.minutesToRounds(1)),
            new Effect('Fly', this.minutesToRounds(10)),
            new Effect('Invisibility', this.minutesToRounds(60)),
            new Effect('Jump', this.minutesToRounds(1)),
            new Effect('Mirror Image', this.minutesToRounds(1)),
            new Effect('Longstrider', this.minutesToRounds(60)),
            new Effect('See Invisibility', this.minutesToRounds(60))
        ]
    }

    static minutesToRounds(minutes) {
        return minutes * 10;
    }
}
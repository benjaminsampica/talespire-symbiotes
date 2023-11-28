export default class Effect {
    constructor(name, roundDuration) {
        this.name = name;
        this.roundDuration = roundDuration;
    }

    static list() {
        return [
            new Effect('Bless', this.minutesAsRounds(1)),
            new Effect('Blink', this.minutesAsRounds(1)),
            new Effect('Cats Grace', this.minutesAsRounds(1)),
            new Effect('Charm Person', this.minutesAsRounds(60)),
            new Effect('Dominate Person', this.minutesAsRounds(1)),
            new Effect('Effect', this.minutesAsRounds(1)),
            new Effect('Enlarge/Reduce', this.minutesAsRounds(1)),
            new Effect('Expeditious Retreat', this.minutesAsRounds(10)),
            new Effect('Guidance', this.minutesAsRounds(1)),
            new Effect('Haste', this.minutesAsRounds(1)),
            new Effect('Heroism', this.minutesAsRounds(1)),
            new Effect('Faerie Fire', this.minutesAsRounds(1)),
            new Effect('Feather Fall', this.minutesAsRounds(1)),
            new Effect('Fly', this.minutesAsRounds(10)),
            new Effect('Invisibility', this.minutesAsRounds(60)),
            new Effect('Jump', this.minutesAsRounds(1)),
            new Effect('Mirror Image', this.minutesAsRounds(1)),
            new Effect('Longstrider', this.minutesAsRounds(60)),
            new Effect('See Invisibility', this.minutesAsRounds(60))
        ]
    }

    static minutesAsRounds(minutes) {
        return minutes * 10;
    }
}
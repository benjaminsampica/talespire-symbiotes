export default class Effect {
    constructor(name, roundDuration) {
        this.name = name;
        this.roundDuration = roundDuration;
    }

    static customEffects = [];

    static addCustomEffect(name, roundDuration) {
        let effect = new Effect(name, roundDuration);
        this.customEffects.push(effect);

        return effect;
    }

    static removeCustomEffect(name) {
        this.customEffects = this.customEffects.filter(c => name !== c.name);
    }

    static baseEffects() {
        return [
            new Effect('Banishment', this.minutesAsRounds(1)),
            new Effect('Bless', this.minutesAsRounds(1)),
            new Effect('Blink', this.minutesAsRounds(1)),
            new Effect('Cats Grace', this.minutesAsRounds(1)),
            new Effect('Charm Person', this.minutesAsRounds(60)),
            new Effect('Dominate Person', this.minutesAsRounds(1)),
            new Effect('Enlarge/Reduce', this.minutesAsRounds(1)),
            new Effect('Expeditious Retreat', this.minutesAsRounds(10)),
            new Effect('Greater Invisibility', this.minutesAsRounds(1)),
            new Effect('Guidance', this.minutesAsRounds(1)),
            new Effect('Haste', this.minutesAsRounds(1)),
            new Effect('Heroism', this.minutesAsRounds(1)),
            new Effect('Hex', this.minutesAsRounds(60)),
            new Effect('Faerie Fire', this.minutesAsRounds(1)),
            new Effect('Feather Fall', this.minutesAsRounds(1)),
            new Effect('Fly', this.minutesAsRounds(10)),
            new Effect('Invisibility', this.minutesAsRounds(60)),
            new Effect('Jump', this.minutesAsRounds(1)),
            new Effect('Mirror Image', this.minutesAsRounds(1)),
            new Effect('Modify Memory', this.minutesAsRounds(1)),
            new Effect('Polymorph', this.minutesAsRounds(60)),
            new Effect('Longstrider', this.minutesAsRounds(60)),
            new Effect('See Invisibility', this.minutesAsRounds(60)),
            new Effect('Summon Aberration', this.minutesAsRounds(60)),
            new Effect('Telekinesis', this.minutesAsRounds(10))
        ]
    }

    static list() {
        const newObjectCustomEffects = this.customEffects.map(ce => Object.assign({}, ce));
        return this.baseEffects().concat(newObjectCustomEffects).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    }

    static minutesAsRounds(minutes) {
        return minutes * 10;
    }
}

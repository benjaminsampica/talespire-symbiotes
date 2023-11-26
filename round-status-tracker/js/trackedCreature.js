class TrackedCreature {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.buffs = [];
        this.conditions = [];
        this.round = 0;
    }

    incrementRound() {
        this.buffs.forEach(b => {
            b.roundDuration--;
        });;

        this.round++;
    }

    decrementRound()
    {
        this.buffs.forEach(b => {
            b.roundDuration++;
        });;

        this.round--;
    }

    addBuff(buff)
    {
        this.buffs.push(buff);
    }

    overrideIncrementBuff(index) {
        this.buffs[index].roundDuration++;
    }

    overrideDecrementBuff(index) {
        this.buffs[index].roundDuration--;
    }
}

module.exports = TrackedCreature
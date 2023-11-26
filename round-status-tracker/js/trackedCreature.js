const Buff = require("./buff");
const Condition = require("./condition");

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
        this.buffs.forEach((b, i) => {
            b.roundDuration++;
        });;

        this.round--;
    }

    addBuff(name)
    {
        this.buffs.push(Buff.List().find(b => b.name == name));
    }

    removeBuff(name)
    {
        this.buffs = this.buffs.filter(b => b.name !== name);
    }

    addCondition(name)
    {
        this.conditions.push(Condition.List().find(c => c.name == name));
    }

    removeCondition(name)
    {
        this.conditions = this.conditions.filter(c => name !== c.name);
    }

    overrideIncrementBuff(index) {
        this.buffs[index].roundDuration++;
    }

    overrideDecrementBuff(index) {
        this.buffs[index].roundDuration--;
    }
}

module.exports = TrackedCreature
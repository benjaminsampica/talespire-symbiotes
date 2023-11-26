import Buff from "./buff";
import Condition from "./condition";

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

    decrementRound() {
        this.buffs.forEach((b, i) => {
            b.roundDuration++;
        });;

        this.round--;
    }

    addBuff(name) {
        if (this.buffs.find(b => b.name === name)) return;

        this.buffs.push(Buff.list().find(b => b.name === name));
    }

    removeBuff(name) {
        this.buffs = this.buffs.filter(b => b.name !== name);
    }

    addCondition(name) {
        if (this.conditions.find(c => c.name === name)) return;

        this.conditions.push(Condition.list().find(c => c.name === name));
    }

    removeCondition(name) {
        this.conditions = this.conditions.filter(c => name !== c.name);
    }

    overrideIncrementBuff(index) {
        this.buffs[index].roundDuration++;
    }

    overrideDecrementBuff(index) {
        this.buffs[index].roundDuration--;
    }
}

export default TrackedCreature
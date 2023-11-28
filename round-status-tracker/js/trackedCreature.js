import Buff from "./buff.js";
import Condition from "./condition.js";

export default class TrackedCreature {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.buffs = [];
        this.conditions = [];
    }

    incrementRound() {
        this.buffs.forEach(b => {
            b.roundDuration--;
        });;
    }

    decrementRound() {
        this.buffs.forEach((b, i) => {
            b.roundDuration++;
        });;
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

    overrideIncrementBuff(name) {
        this.buffs.find(b => b.name === name).roundDuration++;
    }

    overrideDecrementBuff(name) {
        this.buffs.find(b => b.name == name).roundDuration--;
    }
}
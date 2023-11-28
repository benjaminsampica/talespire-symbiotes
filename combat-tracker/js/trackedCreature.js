import Effect from "./effect.js";
import Condition from "./condition.js";

export default class TrackedCreature {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.effects = [];
        this.conditions = [];
    }

    incrementRound() {
        this.effects.forEach(b => {
            b.roundDuration--;
        });;
    }

    decrementRound() {
        this.effects.forEach((b, i) => {
            b.roundDuration++;
        });;
    }

    addEffect(name) {
        if (this.effects.find(b => b.name === name)) return;

        this.effects.push(Effect.list().find(b => b.name === name));
    }

    removeEffect(name) {
        this.effects = this.effects.filter(b => b.name !== name);
    }

    addCondition(name) {
        if (this.conditions.find(c => c.name === name)) return;

        this.conditions.push(Condition.list().find(c => c.name === name));
    }

    removeCondition(name) {
        this.conditions = this.conditions.filter(c => name !== c.name);
    }

    overrideIncrementEffect(name) {
        this.effects.find(b => b.name === name).roundDuration++;
    }

    overrideDecrementEffect(name) {
        this.effects.find(b => b.name == name).roundDuration--;
    }
}
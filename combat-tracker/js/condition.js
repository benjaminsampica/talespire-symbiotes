export default class Condition {
    constructor(name) {
        this.name = name;
    }
    
    static customConditions = [];

    static addCustomCondition(name) {
        let condition = new Condition(name);
        this.customConditions.push(condition);

        return condition;
    }

    static removeCustomCondition(name) {
        this.customConditions = this.customConditions.filter(c => name !== c.name);
    }

    static baseConditions() {
        return [
            new Condition('Blinded'),
            new Condition('Charmed'),
            new Condition('Deafened'),
            new Condition('Frightened'),
            new Condition('Grappled'),
            new Condition('Incapacitated'),
            new Condition('Invisible'),
            new Condition('Paralyzed'),
            new Condition('Petrified'),
            new Condition('Poisoned'),
            new Condition('Prone'),
            new Condition('Stunned'),
            new Condition('Unconscious')
        ];
    }

    static list() {
        const newObjectCustomConditions = this.customConditions.map(ce => Object.assign({}, ce));
        return this.baseConditions()
            .concat(newObjectCustomConditions)
            .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    }
}

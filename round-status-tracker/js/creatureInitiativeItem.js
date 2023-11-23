class creatureInitiativeItem {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.buffs = [];
        this.conditions = [];
        this.round = 1;
    }

    incrementRound() {
        this.round++;
    }
}

module.exports = creatureInitiativeItem
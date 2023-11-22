const conditions = [
    'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed',
    'Petrified', 'Poisoned', 'Prone', 'Stunned', 'Unconscious'
];

const buffs = [
    createBuff('Heroism', 10), createBuff('Longstrider', 10)
]

let trackedCreatures = [];
let round = 0;
let currentInitiativeIndex = 0;

function createBuff(name, roundDuration) { return new { name: name, roundDuration: roundDuration } }

function startTracking() {
    round = 0;
    trackedCreatures = TS.initiative.getQueue()
        .filter(entry => entry.kind == "creature")
        .map(entry => new creatureInitiativeItem(entry.id, entry.name));

    if (trackedCreatures.length == 0) {
        setInvalidState("There are no creatures in the initiative queue.");
    }

    triggerNewRound();
}

function handleInitiativeEvents(queue) {
    // TODO: determine what type of event we got. forwards/backwards/add/remove.
    currentInitiativeIndex = queue.activeItemIndex;

    // If forward/backward, we don't need to remap creatures.

    // If Add/Remove, do below.
    let authoritativeTrackedCreatures = queue.items
        .map(item => new creatureInitiativeItem(item.id, item.name));

    let existingTrackedCreatureIds = trackedCreatures.map(ntc => ntc.id);
    trackedCreatures = authoritativeTrackedCreatures
        .map(atc => {
            const isStillAlive = existingTrackedCreatureIds.includes(atc.id);
            if (isStillAlive) {
                const existingTrackedCreature = trackedCreatures.find(tc => tc.id == atc.id);
                atc.buffs = existingTrackedCreature.buffs;
                atc.round = existingTrackedCreature.round;
                atc.conditions = existingTrackedCreature.conditions;
                // TODO: if current initiative index matches this creatures index?
                // TODO: increment round for this creature? (decrement buffs)
            }
        });
}

function refreshTrackedCreaturesDOM() {
    document.getElementById("tracked-creature-template").content.firstElementChild.cloneNode(true);
}

function setInvalidState(message) {
    document.getElementById("invalid-state").classList.remove("d-none");
    document.getElementById("invalid-state-message").innerHTML = message;
}

function triggerNewRound() {
    round++;
    document.getElementById("round-count").innerHTML = round;
}

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
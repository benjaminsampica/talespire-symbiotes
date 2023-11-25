const buff = require('./buff')
const creatureInitiativeItem = require('./creatureInitiativeItem')

const conditions = [
    'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed',
    'Petrified', 'Poisoned', 'Prone', 'Stunned', 'Unconscious'
];

const buffs = [
    new buff('Heroism', 10)
]

let trackedCreatures = [];
let round = 0;
let currentInitiativeIndex = 0;

function createBuff(name, roundDuration) { return new { name: name, roundDuration: roundDuration } }

function startTracking() {
    round = 0;
    trackedCreatures = mapOnlyCreatures(TS.initiative.getQueue());

    if (trackedCreatures.length == 0) {
        setInvalidState("There are no creatures in the initiative queue.");
    }

    triggerNewRound();
}

function handleInitiativeEvents(queue) {
    // TODO: determine what type of event we got. forwards/backwards/add/remove.
    currentInitiativeIndex = queue.activeItemIndex;

    const remappedCreatures = remapCreatures(trackedCreatures, queue);
}

function remapCreatures(existingTrackedCreatures, queue) {
    let authoritativeTrackedCreatures = mapOnlyCreatures(queue.items);

    return authoritativeTrackedCreatures
        .map(atc => {
            const existingTrackedCreature = existingTrackedCreatures.find(etc => etc.id == atc.id);
            if (existingTrackedCreature !== undefined) {
                atc.buffs = existingTrackedCreature.buffs;
                atc.round = existingTrackedCreature.round;
                atc.conditions = existingTrackedCreature.conditions;
            }

            return atc;
        });
}

function mapOnlyCreatures(items)
{
    return items
        .filter(entry => entry.kind == "creature")
        .map(entry => new creatureInitiativeItem(entry.id, entry.name))
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

exports.remapCreatures = remapCreatures
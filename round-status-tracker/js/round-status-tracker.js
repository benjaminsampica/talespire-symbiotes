const buff = require('./buff')
const trackedCreature = require('./trackedCreature')

const conditions = [
    'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed',
    'Petrified', 'Poisoned', 'Prone', 'Stunned', 'Unconscious'
];

const buffs = [
    new buff('Heroism', 10)
]

let trackedCreatures = [];
let round = 0;
let activeCreatureIndex = 0;

function startTracking() {
    round = 0;
    trackedCreatures = mapOnlyCreatures(TS.initiative.getQueue());

    if (trackedCreatures.length == 0) {
        setInvalidState("There are no creatures in the initiative queue.");
    }

    triggerNewRound();
}

function handleInitiativeEvents(queue) {
    trackedCreatures = remapCreatures(trackedCreatures, queue);
    updateLastTurnCreature(trackedCreatures, queue.activeItemIndex);
    refreshTrackedCreaturesDOM(trackedCreatures);

    if(isNewRound(queue.activeItemIndex))
    {
        triggerNewRound();
    }

    activeCreatureIndex = queue.activeItemIndex;
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

function updateLastTurnCreature(trackedCreatures, authoritativeIndex)
{
    const lastTurnCreature = trackedCreatures[activeCreatureIndex];
    const turnHasIncremented = activeCreatureIndex + 1 == authoritativeIndex;
    if(turnHasIncremented)
    {
        lastTurnCreature.incrementRound();
    }
    else {
        lastTurnCreature.decrementRound();
    }
}

function isNewRound(authoritativeIndex)
{
    return activeCreatureIndex !== authoritativeIndex - 1; // The index only moves more than one position when a round has passed (e.g. the first creature's turn has begun for the second time.)
}

function mapOnlyCreatures(items)
{
    return items
        .filter(entry => entry.kind == "creature")
        .map(entry => new trackedCreature(entry.id, entry.name))
}

function refreshTrackedCreaturesDOM(trackedCreatures) {
    var template = document.getElementById("tracked-creature-template").content.firstElementChild.cloneNode(true);
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
exports.updateLastTurnCreature = updateLastTurnCreature
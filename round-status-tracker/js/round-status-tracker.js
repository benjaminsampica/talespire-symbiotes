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

    if (trackedCreatures.length <= 2) {
        setInvalidState("Must be 3 or more creatures in the initiative queue to start tracking.");
    }

    triggerNewRound();
}

function handleInitiativeEvents(queue) {
    trackedCreatures = remapCreatures(trackedCreatures, queue);

    if(isNewRound(activeCreatureIndex, queue.activeItemIndex))
    {
        triggerNewRound();
    }

    updateTurnForCreatures(trackedCreatures, queue.activeItemIndex);
    refreshTrackedCreaturesDOM(trackedCreatures);
}

function remapCreatures(existingTrackedCreatures, queue) {
    let actualTrackedCreatures = mapOnlyCreatures(queue.items);

    return actualTrackedCreatures
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

function updateTurnForCreatures(trackedCreatures, actualCreatureIndex)
{
    const turnHasIncremented = isNewRound(activeCreatureIndex, actualCreatureIndex) 
        ? activeCreatureIndex > actualCreatureIndex 
        : activeCreatureIndex + 1 == actualCreatureIndex;

    if(turnHasIncremented)
    {
        const lastTurnCreature = trackedCreatures[activeCreatureIndex];
        lastTurnCreature.incrementRound();
    }
    else 
    {
        const currentTurnCreature = trackedCreatures[actualCreatureIndex];
        currentTurnCreature.decrementRound();
    }

    activeCreatureIndex = actualCreatureIndex;
}

function isNewRound(activeCreatureIndex, actualCreatureIndex)
{
    // The index only moves more than one position when a round has passed (e.g. the first creature's turn has begun for the second time.). 
    // A new round can occur both when the index in incremented in the following ways:
    // Example: 10 creatures on initiative list (0 thru 9)
    // Creature 9 finishes their turn and the turn moves back to Creature 0 (new round)
    // Creature 0 is still taking their turn but Creature 9 forgot to do something and the turn moves back (new round).
    // NOTE: There is a limitation for only _two_ creatures. There isn't enough data available from Talespire to determine if the turn went backwards or went to a new round.

    return activeCreatureIndex - 1 !== actualCreatureIndex && activeCreatureIndex + 1 !== actualCreatureIndex; 
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
exports.updateTurnForCreatures = updateTurnForCreatures
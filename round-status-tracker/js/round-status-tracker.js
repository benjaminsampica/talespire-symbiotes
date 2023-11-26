import TrackedCreature from './trackedCreature.js';

var trackedCreatures = [];
var round;
var activeCreatureIndex = 0;

async function startTrackingAsync() {
    round = 0;
    const taleSpireQueue = await TS.initiative.getQueue();
    trackedCreatures = mapOnlyCreatures(taleSpireQueue.items);

    if (trackedCreatures.length <= 2) {
        setInvalidState("Must be 3 or more creatures in the initiative queue to start tracking.");
    }
    else {
        refreshTrackedCreaturesDOM(trackedCreatures);
        triggerNewRound();
    }
}

function handleInitiativeEvents(queue) {
    trackedCreatures = remapCreatures(trackedCreatures, queue);

    if (isNewRound(activeCreatureIndex, queue.activeItemIndex)) {
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

function updateTurnForCreatures(trackedCreatures, actualCreatureIndex) {
    const turnHasIncremented = isNewRound(activeCreatureIndex, actualCreatureIndex)
        ? activeCreatureIndex > actualCreatureIndex
        : activeCreatureIndex + 1 == actualCreatureIndex;

    if (turnHasIncremented) {
        const lastTurnCreature = trackedCreatures[activeCreatureIndex];
        lastTurnCreature.incrementRound();
    }
    else {
        const currentTurnCreature = trackedCreatures[actualCreatureIndex];
        currentTurnCreature.decrementRound();
    }

    activeCreatureIndex = actualCreatureIndex;
}

function isNewRound(activeCreatureIndex, actualCreatureIndex) {
    // The index only moves more than one position when a round has passed (e.g. the first creature's turn has begun for the second time.). 
    // A new round can occur when the index in incremented in the following ways:
    // Example: 10 creatures on initiative list (0 thru 9)
    // 1. Creature 9 finishes their turn and the turn moves back to Creature 0 (new round)
    // 2. Creature 0 is still taking their turn but Creature 9 forgot to do something and the turn moves back (new round).
    // NOTE: There is a limitation for only _two_ creatures. There isn't enough data available from Talespire to determine if the turn went backwards or went to a new round.

    return activeCreatureIndex - 1 !== actualCreatureIndex && activeCreatureIndex + 1 !== actualCreatureIndex;
}

function mapOnlyCreatures(items) {
    return items
        .filter(entry => entry.kind == "creature") // Talespire is planning on including other kinds of entries in the item list so we want to only include creature types.
        .map(entry => new TrackedCreature(entry.id, entry.name))
}

function refreshTrackedCreaturesDOM(trackedCreatures) {
    const trackedCreaturesList = document.getElementById("tracked-creatures-list");

    trackedCreaturesList.innerHTML = buildTrackedCreaturesHtml(trackedCreatures, activeCreatureIndex);
}

function buildTrackedCreaturesHtml(trackedCreatures, activeCreatureIndex) {
    const nameTemplate = `
        <p class='creature'>name</p>
    `;
    const buffTemplate = `
    <div class='buff'>
        <i class="ts-icon-chevron-up"></i>
        <p>name</p>
        <button class='ml-auto' onclick="overrideIncrementBuff(creatureIndex, name)">+</button>
        <p>duration</p>
        <button onclick="overrideDecrementBuff(creatureIndex, name)">-</button>
    </div>
    `;
    const conditionTemplate = `
    <div class='condition'>
        <i class="ts-icon-chevron-up"></i>
        <p>name</p>
        <button class='ml-auto' onclick="removeCondition(creatureIndex, name)">-</button>
    </div>
    `;

    let trackedCreatureHtml = '<div>';
    trackedCreatures.forEach((tc, i) => {
        trackedCreatureHtml += nameTemplate.replace('name', tc.name);
        if (i == activeCreatureIndex) {
            trackedCreatureHtml = trackedCreatureHtml.replace('creature', 'creature active')
        }

        tc.buffs.forEach(b => {
            if (b.roundDuration >= 0) {
                trackedCreatureHtml += buffTemplate.replace(new RegExp('name', 'g'), b.name)
                    .replace('creatureIndex', i)
                    .replace('duration', b.roundDuration);
            }
        });

        tc.conditions.forEach(c => {
            trackedCreatureHtml += conditionTemplate.replace(new RegExp('name', 'g'), c.name)
                .replace('creatureIndex', i);
        });
    });
    trackedCreatureHtml += '<div>';

    return trackedCreatureHtml;
}

function addBuff(creatureIndex, name) {
    trackedCreatures[creatureIndex].addBuff(name);

    refreshTrackedCreaturesDOM(trackedCreatures);
}

function removeBuff(creatureIndex, name) {
    trackedCreatures[creatureIndex].removeBuff(name);

    refreshTrackedCreaturesDOM(trackedCreatures);
}

function overrideIncrementBuff(creatureIndex, buffIndex) {
    trackedCreatures[creatureIndex].overrideIncrementBuff(buffIndex);

    refreshTrackedCreaturesDOM(trackedCreatures);
}

function overrideDecrementBuff(creatureIndex, buffIndex) {
    trackedCreatures[creatureIndex].overrideDecrementBuff(buffIndex);

    refreshTrackedCreaturesDOM(trackedCreatures);
}

function addCondition(creatureIndex, name) {
    trackedCreatures[creatureIndex].addCondition(name);

    refreshTrackedCreaturesDOM(trackedCreatures);
}

function removeCondition(creatureIndex, name) {
    trackedCreatures[creatureIndex].removeCondition(name);

    refreshTrackedCreaturesDOM(trackedCreatures);
}

function setInvalidState(message) {
    document.getElementById("invalid-state").classList.remove("d-none");
    document.getElementById("invalid-state-message").innerHTML = message;
}

function triggerNewRound() {
    round++;
    document.getElementById("round-count").innerHTML = round;
}

export default { updateTurnForCreatures, remapCreatures, buildTrackedCreaturesHtml };

window.startTrackingAsync = startTrackingAsync;
window.handleInitiativeEvents = handleInitiativeEvents;
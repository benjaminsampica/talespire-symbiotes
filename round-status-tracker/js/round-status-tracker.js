import TrackedCreature from './trackedCreature.js';
import AddBuffForm from './add-buff.js';

var trackedCreatures = [];
var round;
var activeCreatureIndex = 0;
var addBuffForm;

async function startTrackingAsync() {
    round = 0;
    const taleSpireQueue = await TS.initiative.getQueue();
    trackedCreatures = mapOnlyCreatures(taleSpireQueue.items);

    if (trackedCreatures.length <= 2) {
        setInvalidState("There must be 3 or more creatures in the initiative queue to start tracking.");
    }
    else {
        resetInvalidState();
        refreshTrackedCreaturesDOM(trackedCreatures);
        triggerNewRound(true);
    }
}

function handleInitiativeEvents(queue) {
    // TODO: Bug when adding/removing creatures that is decrementing the round counter.
    trackedCreatures = remapCreatures(trackedCreatures, queue.payload.items);

    const [isNewRound, isRoundIncrementing] = calculateNewRoundStatus(activeCreatureIndex, queue.payload.activeItemIndex);
    if (isNewRound) {
        triggerNewRound(isRoundIncrementing);
    }

    updateTurnForCreatures(trackedCreatures, queue.payload.activeItemIndex);
    refreshTrackedCreaturesDOM(trackedCreatures);
}

function remapCreatures(existingTrackedCreatures, items) {
    let actualTrackedCreatures = mapOnlyCreatures(items);

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
    const [isNewRound, _] = calculateNewRoundStatus(activeCreatureIndex, actualCreatureIndex);

    const turnHasIncremented = isNewRound
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

function calculateNewRoundStatus(activeCreatureIndex, actualCreatureIndex) {
    // The index only moves more than one position when a round has passed (e.g. the first creature's turn has begun for the second time.). 
    // A new round can occur when the index in incremented in the following ways:
    // Example: 10 creatures on initiative list (0 thru 9)
    // 1. Creature 9 finishes their turn and the turn moves back to Creature 0 (new round)
    // 2. Creature 0 is still taking their turn but Creature 9 forgot to do something and the turn moves back (new round).
    // NOTE: There is a limitation for only _two_ creatures. There isn't enough data available from Talespire to determine if the turn went backwards or went to a new round.

    const isNewRound = activeCreatureIndex - 1 !== actualCreatureIndex && activeCreatureIndex + 1 !== actualCreatureIndex;
    const isRoundIncrementing = actualCreatureIndex < activeCreatureIndex;

    return [isNewRound, isRoundIncrementing];
}

function mapOnlyCreatures(items) {
    return items
        .filter(entry => entry.kind == "creature") // Talespire is planning on including other kinds of entries in the item list so we want to only include creature types.
        .map(entry => new TrackedCreature(entry.id, entry.name));
}

function refreshTrackedCreaturesDOM(trackedCreatures) {
    const trackedCreaturesList = document.getElementById("tracked-creatures-list");

    trackedCreaturesList.innerHTML = buildTrackedCreaturesHtml(trackedCreatures, activeCreatureIndex);
}

function buildTrackedCreaturesHtml(trackedCreatures, activeCreatureIndex) {
    const nameTemplate = `
    <div class="creature">
        <h3>name</h3>
        <button onclick="addBuff(creatureIndex, name)" class="buff-icon ml-auto"><i class="ts-icon-character-arrow-up"></i></button>
        <button onclick="addCondition(creatureIndex, name)" class="condition-icon"><i class="ts-icon-character-confused"></i></button>
    </div>
    `;
    const buffTemplate = `
    <div class='buff'>
        <i class="ts-icon-character-arrow-up buff-icon"></i>
        <p>name</p>
        <button class='ml-auto' onclick="overrideIncrementBuff(creatureIndex, name)">+</button>
        <p>duration</p>
        <button onclick="overrideDecrementBuff(creatureIndex, name)">-</button>
    </div>
    `;
    const conditionTemplate = `
    <div class='condition'>
        <i class="tts-icon-character-confused condition-icon"></i>
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

function addBuff(creatureIndex) {
    addBuffForm = new AddBuffForm(trackedCreatures[creatureIndex], refreshTrackedCreaturesDOM(trackedCreatures));
}

function cancelBuffSubmission()
{
    addBuffForm.cancelBuffSubmission();
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

function resetInvalidState() {
    document.getElementById("invalid-state").classList.add("d-none");
    document.getElementById("invalid-state-message").innerHTML = '';
}

function triggerNewRound(isIncrementing) {
    if(isIncrementing)
    {
        round++;
    }
    else {
        round--;
    }

    document.getElementById("round-count").innerHTML = round;
}

export default { updateTurnForCreatures, remapCreatures, buildTrackedCreaturesHtml, calculateNewRoundStatus };

window.startTrackingAsync = startTrackingAsync;
window.handleInitiativeEvents = handleInitiativeEvents;
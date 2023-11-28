import CreatureStateService from './creatureStateService.js';
import InvalidStateService from './invalidStateService.js';
import AddConditionForm from './addConditionForm.js';
import AddEffectForm from './addEffectForm.js';

let round;
let addEffectForm;
let addConditionForm;
const creatureStateService = new CreatureStateService(refreshTrackedCreaturesDOM, [], 0, window.TS);

document.addEventListener("click", function (e) {
    const target = e.target.closest("#trigger-condition-form");

    if (target) {
        const creatureIndex = target.value;
        addConditionForm = new AddConditionForm(creatureStateService.trackedCreatures[creatureIndex], refreshTrackedCreaturesDOM);
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#submit-condition-form");

    if (target) {
        addConditionForm.submit();
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#cancel-condition-form");

    if (target) {
        addConditionForm.cancel();
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#trigger-effect-form");

    if (target) {
        const creatureIndex = target.value;
        addEffectForm = new AddEffectForm(creatureStateService.trackedCreatures[creatureIndex], refreshTrackedCreaturesDOM);
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#submit-effect-form");

    if (target) {
        addEffectForm.submit();
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#cancel-effect-form");

    if (target) {
        addEffectForm.cancel();
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#trigger-override-effect-increment");

    if (target) {
        let effect = target.dataset.effect;
        let index = target.dataset.index;
        creatureStateService.overrideIncrementEffect(index, effect)
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#trigger-override-effect-decrement");

    if (target) {
        let effect = target.dataset.effect;
        let index = target.dataset.index;
        creatureStateService.overrideDecrementEffect(index, effect)
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#trigger-effect-removal");

    if (target) {
        let effect = target.dataset.effect;
        let index = target.dataset.index;
        creatureStateService.removeEffect(index, effect)
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#trigger-condition-removal");

    if (target) {
        let condition = target.dataset.condition;
        let index = target.dataset.creatureIndex;
        creatureStateService.removeCondition(index, condition)
    }
});

async function startTrackingAsync() {
    round = 0;
    await creatureStateService.populateTaleSpireCreaturesAsync();

    if (creatureStateService.trackedCreatures.length <= 2) {
        InvalidStateService.setInvalidState("There must be 3 or more creatures in the initiative queue to start tracking.");
    }
    else {
        InvalidStateService.resetInvalidState();
        refreshTrackedCreaturesDOM();
        triggerNewRound(true);
    }
}

function handleInitiativeEvents(queue) {
    // TODO: Bug when adding/removing creatures that is decrementing the round counter.
    creatureStateService.remapCreatures(queue.payload.items);

    const [isNewRound, isRoundIncrementing] = calculateNewRoundStatus(creatureStateService.activeCreatureIndex, queue.payload.activeItemIndex);
    if (isNewRound) {
        triggerNewRound(isRoundIncrementing);
    }

    creatureStateService.updateTurnForCreatures(queue.payload.activeItemIndex, isNewRound);
}

function calculateNewRoundStatus(activeCreatureIndex, actualCreatureIndex) {
    // The index only moves more than one position when a round has passed (e.g. the first creature's turn has begun for the second time.). 
    // A new round can occur when the index in incremented in the following ways:
    // Example: 10 creatures on initiative list (0 thru 9)
    // 1. Creature 9 finishes their turn and the turn moves back to Creature 0 (new round)
    // 2. Creature 0 is still taking their turn but Creature 9 forgot to do something and the turn moves back (new round).
    // NOTE: There is a limitation for only _two_ creatures. There isn't enough data available from TaleSpire to determine if the turn went backwards or went to a new round.

    const isNewRound = activeCreatureIndex - 1 !== actualCreatureIndex && activeCreatureIndex + 1 !== actualCreatureIndex;
    const isRoundIncrementing = actualCreatureIndex < activeCreatureIndex;

    return [isNewRound, isRoundIncrementing];
}

function refreshTrackedCreaturesDOM() {
    document.getElementById("tracked-creatures-list").innerHTML = creatureStateService.buildTrackedCreaturesHtml();
}

function triggerNewRound(isIncrementing) {
    if (isIncrementing) {
        round++;
    }
    else {
        round--;
    }

    document.getElementById("round-count").innerHTML = round;
}

export default {
    calculateNewRoundStatus,
    startTrackingAsync,
    handleInitiativeEvents
};
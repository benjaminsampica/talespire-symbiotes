import TrackedCreature from './trackedCreature.js'

export default class CreatureStateService {
    constructor(onCreatureChangedCallback, trackedCreatures = [], activeCreatureIndex = 0, taleSpireService) {
        this.trackedCreatures = trackedCreatures;
        this.activeCreatureIndex = activeCreatureIndex;
        this.onCreatureChangedCallback = onCreatureChangedCallback;
        this.taleSpireService = taleSpireService;
    }

    async populateTaleSpireCreaturesAsync() {
        const taleSpireQueue = await this.taleSpireService.initiative.getQueue();
        let trackedCreatures = this.mapOnlyCreatures(taleSpireQueue.items);
        this.activeCreatureIndex = taleSpireQueue.activeItemIndex;

        this.trackedCreatures = trackedCreatures;
    }

    remapCreatures(items) {
        let actualTrackedCreatures = this.mapOnlyCreatures(items);

        this.trackedCreatures = actualTrackedCreatures
            .map(atc => {
                const existingTrackedCreature = this.trackedCreatures.find(etc => etc.id == atc.id);
                if (existingTrackedCreature !== undefined) {
                    atc.effects = existingTrackedCreature.effects;
                    atc.round = existingTrackedCreature.round;
                    atc.conditions = existingTrackedCreature.conditions;
                }

                return atc;
            });
    }

    mapOnlyCreatures(items) {
        return items
            .filter(entry => entry.kind == "creature") // TaleSpire is planning on including other kinds of entries in the item list so we want to only include creature types.
            .map(entry => new TrackedCreature(entry.id, entry.name));
    }

    updateTurnForCreatures(actualCreatureIndex, isNewRound) {
        const turnHasIncremented = isNewRound
            ? this.activeCreatureIndex > actualCreatureIndex
            : this.activeCreatureIndex + 1 == actualCreatureIndex;

        if (turnHasIncremented) {
            const lastTurnCreature = this.trackedCreatures[this.activeCreatureIndex];
            if (lastTurnCreature !== null && lastTurnCreature !== undefined) {
                lastTurnCreature.incrementRound();
            }

        }
        else {
            const currentTurnCreature = this.trackedCreatures[actualCreatureIndex];
            if (currentTurnCreature !== null && currentTurnCreature !== undefined) {
                currentTurnCreature.decrementRound();
            }

        }

        this.activeCreatureIndex = actualCreatureIndex;

        this.onCreatureChangedCallback();
    }

    overrideIncrementEffect(creatureIndex, effectIndex) {
        this.trackedCreatures[creatureIndex].overrideIncrementEffect(effectIndex);

        this.onCreatureChangedCallback();
    }

    overrideDecrementEffect(creatureIndex, effectIndex) {
        this.trackedCreatures[creatureIndex].overrideDecrementEffect(effectIndex);

        this.onCreatureChangedCallback();
    }

    removeCondition(creatureIndex, name) {
        this.trackedCreatures[creatureIndex].removeCondition(name);

        this.onCreatureChangedCallback();
    }

    removeEffect(creatureIndex, name) {
        this.trackedCreatures[creatureIndex].removeEffect(name);

        this.onCreatureChangedCallback();
    }

    buildTrackedCreaturesHtml() {
        const nameTemplate = `
        <div class="creature">
            <h3 class='d-flex align-center'>
                name
            </h3>
            <button value="creatureIndex" id='trigger-effect-form' class="effect-icon-button ml-auto"><i class="ts-icon-character-arrow-up ts-icon-small"></i></button>
            <button value="creatureIndex" id='trigger-condition-form' class="condition-icon"><i class="ts-icon-character-confused ts-icon-small"></i></button>
        </div>
        `;
        const effectTemplate = `
        <div class='effect'>
            <i class="ts-icon-character-arrow-up effect-icon-standalone icon-standalone ts-icon-small"></i>
            <h4 class='d-flex align-center'>name</h4>
            <button class='ml-auto' id='trigger-override-effect-increment' data-effect='name' data-index='creatureIndex'>
                <i class='ts-icon-plus ts-icon-xsmall'></i>
            </button>
            <h3>duration</h3>
            <button id='trigger-override-effect-decrement' data-effect='name' data-index='creatureIndex'>
                <i class='ts-icon-minus ts-icon-xsmall'></i>
            </button>
            <button id='trigger-effect-removal' data-effect='name' data-index='creatureIndex'>
                <i class='ts-icon-remove ts-icon-xsmall'></i>
            </button>
        </div>
        `;
        const conditionTemplate = `
        <div class='condition'>
            <i class="ts-icon-character-confused condition-icon-standalone icon-standalone ts-icon-small"></i>
            <h5 class='d-flex align-center'>name</h5>
            <button class='ml-auto' id='trigger-condition-removal' data-condition='name' data-index='creatureIndex'>
                <i class='ts-icon-remove ts-icon-xsmall'></i>
            </button>
        </div>
        `;

        let trackedCreaturesHtml = '';
        this.trackedCreatures.forEach((tc, i) => {
            let trackedCreatureHtml = `<div class='tracked-creature'>`

            if (i == this.activeCreatureIndex) {
                trackedCreatureHtml = trackedCreatureHtml.replace('tracked-creature', 'tracked-creature active')
            }

            trackedCreatureHtml += nameTemplate.replace('name', tc.name)
                .replace(new RegExp('creatureIndex', 'g'), i);

            tc.effects.forEach(b => {
                if (b.roundDuration > 0) {
                    trackedCreatureHtml += effectTemplate.replace(new RegExp('name', 'g'), b.name)
                        .replace(new RegExp('creatureIndex', 'g'), i)
                        .replace('duration', b.roundDuration);
                }
            });

            tc.conditions.forEach(c => {
                trackedCreatureHtml += conditionTemplate.replace(new RegExp('name', 'g'), c.name)
                    .replace(new RegExp('creatureIndex', 'g'), i);
            });

            trackedCreatureHtml += `</div>`;

            trackedCreaturesHtml += trackedCreatureHtml;
        });
        trackedCreaturesHtml += '';

        return trackedCreaturesHtml;
    }
}
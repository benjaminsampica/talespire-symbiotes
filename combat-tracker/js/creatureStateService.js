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
                    atc.conditions = existingTrackedCreature.conditions;
                    atc.isConcentrating = existingTrackedCreature.isConcentrating;
                    atc.initiative = existingTrackedCreature.initiative;
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

    toggleConcentration(creatureIndex) {
        this.trackedCreatures[creatureIndex].toggleConcentration();

        this.onCreatureChangedCallback();
    }

    updateInitiative(creatureIndex, initiative) {
        this.trackedCreatures[creatureIndex].updateInitiative(initiative);

        this.onCreatureChangedCallback();
    }

    buildTrackedCreaturesHtml() {
        const nameTemplate = `
        <h3 class="creature d-flex align-center">
            name
            <button class='button-concentration' id='button-toggle-concentration' data-index='creatureIndex'>
                <i class='icon icon-concentration ts-icon-small'></i>
            </button>
            <i class='icon icon-standalone ts-icon-d20-grey ts-icon-small'></i>
            <input type='number' style="width: 50px;" data-index='creatureIndex' name='input-creature-initiative' id='input-creature-initiative' placeholder='20' value='creatureInitiative'></input>
            <button value="creatureIndex" id='trigger-effect-form' class="ml-auto bg-effect">
                <i class="icon icon-effect ts-icon-small"></i>
            </button>
            <button value="creatureIndex" id='trigger-condition-form' class="icon bg-condition">
                <i class="icon condition-icon ts-icon-small"></i>
            </button>
        </h3>
        `;
        const effectTemplate = `
        <h4 class='effect d-flex align-center'>
            <i class="icon icon-standalone icon-effect bg-effect ts-icon-small"></i>
            name
            <button class='ml-auto' id='trigger-override-effect-increment' data-effect='name' data-index='creatureIndex'>
                <i class='icon ts-icon-plus ts-icon-small'></i>
            </button>
            duration
            <button id='trigger-override-effect-decrement' data-effect='name' data-index='creatureIndex'>
                <i class='icon ts-icon-minus ts-icon-small'></i>
            </button>
            <button id='trigger-effect-removal' data-effect='name' data-index='creatureIndex'>
                <i class='icon ts-icon-remove ts-icon-small'></i>
            </button>
        </h4>
        `;
        const conditionTemplate = `
        <h4 class='condition d-flex align-center'>
            <i class="icon icon-standalone condition-icon bg-condition ts-icon-small"></i>
            name
            <button class='ml-auto' id='trigger-condition-removal' data-condition='name' data-index='creatureIndex'>
                <i class='icon ts-icon-remove ts-icon-small'></i>
            </button>
        </h4>
        `;

        let trackedCreaturesHtml = '';
        this.trackedCreatures.forEach((tc, i) => {
            let trackedCreatureHtml = `<div class='tracked-creature'>`

            if (i == this.activeCreatureIndex) {
                trackedCreatureHtml = trackedCreatureHtml.replace('tracked-creature', 'tracked-creature active')
            }

            trackedCreatureHtml += nameTemplate.replace('name', tc.name)
                .replace(new RegExp('creatureIndex', 'g'), i);
                
            trackedCreatureHtml = trackedCreatureHtml
                .replace('creatureInitiative', tc.initiative ?? '');

            if (tc.isConcentrating) {
                trackedCreatureHtml = trackedCreatureHtml.replace('button-concentration', 'button-concentration active');
            }

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
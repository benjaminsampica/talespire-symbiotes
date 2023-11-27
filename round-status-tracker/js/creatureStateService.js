import TrackedCreature from './trackedCreature.js';

export default class CreatureStateService {
    constructor(onCreatureChangedCallback, trackedCreatures = [], activeCreatureIndex = 0)
    {
        this.trackedCreatures = trackedCreatures;
        this.activeCreatureIndex = activeCreatureIndex;
        this.onCreatureChangedCallback = onCreatureChangedCallback;
    }

    async populateTalespireCreaturesAsync()
    {
        const taleSpireQueue = await TS.initiative.getQueue();
        this.trackedCreatures = mapOnlyCreatures(taleSpireQueue.items);
    }

    remapCreatures(items) {
        let actualTrackedCreatures = mapOnlyCreatures(items);
    
        return actualTrackedCreatures
            .map(atc => {
                const existingTrackedCreature = this.trackedCreatures.find(etc => etc.id == atc.id);
                if (existingTrackedCreature !== undefined) {
                    atc.buffs = existingTrackedCreature.buffs;
                    atc.round = existingTrackedCreature.round;
                    atc.conditions = existingTrackedCreature.conditions;
                }
    
                return atc;
            });
    }
    
    mapOnlyCreatures(items) {
        return items
            .filter(entry => entry.kind == "creature") // Talespire is planning on including other kinds of entries in the item list so we want to only include creature types.
            .map(entry => new TrackedCreature(entry.id, entry.name));
    }

    updateTurnForCreatures(actualCreatureIndex, isNewRound) {
        const turnHasIncremented = isNewRound
            ? this.activeCreatureIndex > actualCreatureIndex
            : this.activeCreatureIndex + 1 == actualCreatureIndex;
    
        if (turnHasIncremented) {
            const lastTurnCreature = this.trackedCreatures[this.activeCreatureIndex];
            lastTurnCreature.incrementRound();
        }
        else {
            const currentTurnCreature = this.trackedCreatures[actualCreatureIndex];
            currentTurnCreature.decrementRound();
        }
    
        this.activeCreatureIndex = actualCreatureIndex;
    }

    overrideIncrementBuff(creatureIndex, buffIndex) {
        this.trackedCreatures[creatureIndex].overrideIncrementBuff(buffIndex);

        onCreatureChangedCallback();
    }
    
    overrideDecrementBuff(creatureIndex, buffIndex) {
        this.trackedCreatures[creatureIndex].overrideDecrementBuff(buffIndex);

        onCreatureChangedCallback();
    }

    removeCondition(creatureIndex, name) {
        this.trackedCreatures[creatureIndex].removeCondition(name);
    }

    removeBuff(creatureIndex, name) {
        this.trackedCreatures[creatureIndex].removeBuff(name);
    }

    buildTrackedCreaturesHtml(trackedCreatures) {
        const nameTemplate = `
        <div class="creature">
            <h3>name</h3>
            <button value="creatureIndex" id='trigger-buff-form' class="buff-icon ml-auto"><i class="ts-icon-character-arrow-up"></i></button>
            <button value="creatureIndex" id='trigger-condition-form' class="condition-icon"><i class="ts-icon-character-confused"></i></button>
        </div>
        `;
        const buffTemplate = `
        <div class='buff'>
            <i class="ts-icon-character-arrow-up buff-icon"></i>
            <p>name</p>
            <button class='ml-auto' id='trigger-override-buff-increment' data-buff='name' data-creatureIndex='creatureIndex'>+</button>
            <p>duration</p>
            <button id='trigger-override-buff-decrement' data-buff='name' data-creatureIndex='creatureIndex'>-</button>
            <button id='trigger-buff-removal' data-buff='name' data-creatureIndex='creatureIndex'>X</button>
        </div>
        `;
        const conditionTemplate = `
        <div class='condition'>
            <i class="tts-icon-character-confused condition-icon"></i>
            <p>name</p>
            <button class='ml-auto' id='trigger-condition-removal' data-condition='name' data-creatureIndex='creatureIndex'>X</button>
        </div>
        `;
    
        let trackedCreatureHtml = '<div>';
        trackedCreatures.forEach((tc, i) => {
            trackedCreatureHtml += nameTemplate.replace('name', tc.name);
            if (i == this.activeCreatureIndex) {
                trackedCreatureHtml = trackedCreatureHtml.replace('creature', 'creature active')
            }
    
            tc.buffs.forEach(b => {
                if (b.roundDuration >= 0) {
                    trackedCreatureHtml += buffTemplate.replace(new RegExp('name', 'g'), b.name)
                        .replace(new RegExp('creatureIndex', 'g'), i)
                        .replace('duration', b.roundDuration);
                }
            });
    
            tc.conditions.forEach(c => {
                trackedCreatureHtml += conditionTemplate.replace(new RegExp('name', 'g'), c.name)
                    .replace(new RegExp('creatureIndex', 'g'), i);
            });
        });
        trackedCreatureHtml += '<div>';
    
        return trackedCreatureHtml;
    }
}
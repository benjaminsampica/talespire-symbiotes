import TrackedCreature from './trackedCreature';
import { jest } from '@jest/globals';
let sut;

const taleSpireQueueItem = {
    id: 1,
    name: 'Test',
    kind: 'creature'
}

beforeEach(async () => {
    jest.resetModules();
    sut = (await import('./round-status-tracker')).default;
});

test('new creatures map', () => {
    let existingTrackedCreatures = [];
    let queue = {
        items: [taleSpireQueueItem]
    }

    const actualResult = sut.remapCreatures(existingTrackedCreatures, queue);

    let expectedResult = [new TrackedCreature(1, 'Test')];
    expect(actualResult).toEqual(expectedResult)
});

test('existing creatures stay mapped', () => {
    let existingTrackedCreatures = [new TrackedCreature(1, 'Test')];
    let queue = {
        items: [taleSpireQueueItem]
    }

    const actualResult = sut.remapCreatures(existingTrackedCreatures, queue);

    expect(actualResult).toEqual(existingTrackedCreatures)
});

test('missing creatures are removed', () => {
    let existingTrackedCreatures = [new TrackedCreature(1, 'Test')];
    let queue = {
        items: []
    }

    const actualResult = sut.remapCreatures(existingTrackedCreatures, queue);

    expect(actualResult).toEqual([])
});

test('when a turn increments from creature 0 to 1, then creature 0 buff durations go down by 1', () => {
    const creature0 = new TrackedCreature(1, 'Test');
    creature0.addBuff('Heroism');

    const creature1 = new TrackedCreature(1, 'Test');
    creature1.addBuff('Heroism');
    let existingTrackedCreatures = [creature0, creature1];

    sut.updateTurnForCreatures(existingTrackedCreatures, 1);

    expect(creature0.buffs[0].roundDuration).toEqual(9);
});

test('when a turn decrements from creature 1 to 0, then creature 0 buff durations go up by 1', () => {
    const creature0 = new TrackedCreature(1, 'Test');
    creature0.addBuff('Heroism');

    const creature1 = new TrackedCreature(1, 'Test');
    creature1.addBuff('Heroism');

    let existingTrackedCreatures = [creature0, creature1];

    sut.updateTurnForCreatures(existingTrackedCreatures, 1);

    expect(creature0.buffs[0].roundDuration).toEqual(9);

    sut.updateTurnForCreatures(existingTrackedCreatures, 0);

    expect(creature0.buffs[0].roundDuration).toEqual(10);
});

test('when a turn increments from creature 0 to 1 to 2 to 0 then decrements to 2, then creature 2 buff durations go up by 1', () => {
    const creature0 = new TrackedCreature(1, 'Test');
    creature0.addBuff('Heroism');

    const creature1 = new TrackedCreature(1, 'Test');
    creature1.addBuff('Heroism');

    const creature2 = new TrackedCreature(1, 'Test');
    creature2.addBuff('Heroism');
    let existingTrackedCreatures = [creature0, creature1, creature2];

    sut.updateTurnForCreatures(existingTrackedCreatures, 1);
    sut.updateTurnForCreatures(existingTrackedCreatures, 2);
    sut.updateTurnForCreatures(existingTrackedCreatures, 0);

    expect(creature2.buffs[0].roundDuration).toEqual(9);

    sut.updateTurnForCreatures(existingTrackedCreatures, 2);

    expect(creature2.buffs[0].roundDuration).toEqual(10);
});

test('when there are multiple creatures, then builds multiple html elements', () => {
    const creature0 = new TrackedCreature(1, 'Test1');
    const creature1 = new TrackedCreature(1, 'Test2');

    let existingTrackedCreatures = [creature0, creature1];

    const result = sut.buildTrackedCreaturesHtml(existingTrackedCreatures);

    expect(result).toEqual(expect.stringContaining('Test1'));
    expect(result).toEqual(expect.stringContaining('Test2'));
});

test('when there is a creature with multiple buffs, then builds multiple buffs', () => {
    const creature = new TrackedCreature(1, 'Test1');
    creature.addBuff('Heroism');
    creature.addBuff('Bless');

    let existingTrackedCreatures = [creature];

    const result = sut.buildTrackedCreaturesHtml(existingTrackedCreatures);

    expect(result).toEqual(expect.stringContaining('Heroism'));
    expect(result).toEqual(expect.stringContaining('10'));
    expect(result).toEqual(expect.stringContaining('Bless'));
    expect(result).toEqual(expect.stringContaining('10'));
});

test('when there is a creature with multiple conditions, then builds multiple conditions', () => {
    const creature = new TrackedCreature(1, 'Test1');
    creature.addCondition('Blinded');
    creature.addCondition('Charmed');

    let existingTrackedCreatures = [creature];

    const result = sut.buildTrackedCreaturesHtml(existingTrackedCreatures);

    expect(result).toEqual(expect.stringContaining('Blinded'));
    expect(result).toEqual(expect.stringContaining('Charmed'));
});
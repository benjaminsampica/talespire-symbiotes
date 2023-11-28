import TrackedCreature from './trackedCreature.js';
import CreatureStateService from './creatureStateService.js'

const fakeTaleSpireQueueItem = {
    id: 1,
    name: 'Test',
    kind: 'creature'
}

let successCallbackResult;

beforeEach(() => {
    successCallbackResult = false;
})

test('new creatures map', () => {
    let sut = new CreatureStateService();
    let items = [fakeTaleSpireQueueItem];

    sut.remapCreatures(items);

    let expectedResult = [new TrackedCreature(1, 'Test')];
    expect(sut.trackedCreatures).toEqual(expectedResult);
});

test('existing creatures stay mapped', () => {
    let existingTrackedCreatures = [new TrackedCreature(1, 'Test')];
    let sut = new CreatureStateService(null, existingTrackedCreatures);
    let items = [fakeTaleSpireQueueItem];

    sut.remapCreatures(items);

    expect(sut.trackedCreatures).toEqual(existingTrackedCreatures);
});

test('missing creatures are removed', () => {
    let existingTrackedCreatures = [new TrackedCreature(1, 'Test')];
    let sut = new CreatureStateService(null, existingTrackedCreatures);
    let items = []

    sut.remapCreatures(items);

    expect(sut.trackedCreatures).toEqual([]);
});

test('when any turn happens, the success callback is invoked.', () => {
    const creature0 = new TrackedCreature(1, 'Test');
    creature0.addBuff('Heroism');

    let sut = new CreatureStateService(fakeSuccessCallback, [creature0]);

    sut.updateTurnForCreatures(0);

    expect(successCallbackResult).toEqual(true);
});

test('when a turn increments from creature 0 to 1, then creature 0 buff durations go down by 1', () => {
    const creature0 = new TrackedCreature(1, 'Test');
    creature0.addBuff('Heroism');

    const creature1 = new TrackedCreature(1, 'Test');
    creature1.addBuff('Heroism');

    let sut = new CreatureStateService(fakeSuccessCallback, [creature0, creature1]);

    sut.updateTurnForCreatures(1);

    expect(creature0.buffs[0].roundDuration).toEqual(9);
});

test('when a turn decrements from creature 1 to 0, then creature 0 buff durations go up by 1', () => {
    const creature0 = new TrackedCreature(1, 'Test');
    creature0.addBuff('Heroism');

    const creature1 = new TrackedCreature(1, 'Test');
    creature1.addBuff('Heroism');

    let sut = new CreatureStateService(fakeSuccessCallback, [creature0, creature1]);

    sut.updateTurnForCreatures(1);

    expect(creature0.buffs[0].roundDuration).toEqual(9);

    sut.updateTurnForCreatures(0);

    expect(creature0.buffs[0].roundDuration).toEqual(10);
});

test('when a turn increments from creature 0 to 1 to 2 to 0 then decrements to 2, then creature 2 buff durations go up by 1', () => {
    const creature0 = new TrackedCreature(1, 'Test');
    creature0.addBuff('Heroism');

    const creature1 = new TrackedCreature(1, 'Test');
    creature1.addBuff('Heroism');

    const creature2 = new TrackedCreature(1, 'Test');
    creature2.addBuff('Heroism');
    let sut = new CreatureStateService(fakeSuccessCallback, [creature0, creature1, creature2]);

    sut.updateTurnForCreatures(1);
    sut.updateTurnForCreatures(2);
    sut.updateTurnForCreatures(0, true);

    expect(creature2.buffs[0].roundDuration).toEqual(9);

    sut.updateTurnForCreatures(2, true);

    expect(creature2.buffs[0].roundDuration).toEqual(10);
});

test('when the current creature is active, then has active class', () => {
    const creature0 = new TrackedCreature(1, 'Test1');

    let sut = new CreatureStateService(null, [creature0]);

    const result = sut.buildTrackedCreaturesHtml();

    expect(result).toEqual(expect.stringContaining('active'));
});

test('when the current creature is not active, then does not have active class', () => {
    const creature0 = new TrackedCreature(1, 'Test1');

    let sut = new CreatureStateService(null, [creature0], 1);

    const result = sut.buildTrackedCreaturesHtml();

    expect(result).toEqual(expect.not.stringContaining('active'));
});

test('when there are multiple creatures, then builds multiple html elements', () => {
    const creature0 = new TrackedCreature(1, 'Test1');
    const creature1 = new TrackedCreature(1, 'Test2');

    let sut = new CreatureStateService(null, [creature0, creature1]);

    const result = sut.buildTrackedCreaturesHtml();

    expect(result).toEqual(expect.stringContaining('Test1'));
    expect(result).toEqual(expect.stringContaining('Test2'));
});

test('when there is a creature with multiple buffs, then builds multiple buffs', () => {
    const creature = new TrackedCreature(1, 'Test1');
    creature.addBuff('Heroism');
    creature.addBuff('Bless');

    let sut = new CreatureStateService(null, [creature]);

    const result = sut.buildTrackedCreaturesHtml();

    expect(result).toEqual(expect.stringContaining('Heroism'));
    expect(result).toEqual(expect.stringContaining('10'));
    expect(result).toEqual(expect.stringContaining('Bless'));
    expect(result).toEqual(expect.stringContaining('10'));
});

test('when there is a creature with multiple conditions, then builds multiple conditions', () => {
    const creature = new TrackedCreature(1, 'Test1');
    creature.addCondition('Blinded');
    creature.addCondition('Charmed');

    let sut = new CreatureStateService(null, [creature]);

    const result = sut.buildTrackedCreaturesHtml();

    expect(result).toEqual(expect.stringContaining('Blinded'));
    expect(result).toEqual(expect.stringContaining('Charmed'));
});

function fakeSuccessCallback() {
    successCallbackResult = true;
}
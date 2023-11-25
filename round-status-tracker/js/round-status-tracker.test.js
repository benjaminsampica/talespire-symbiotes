const trackedCreature = require('./trackedCreature');
const buff = require('./buff');
const sut = require('./round-status-tracker');

const taleSpireQueueItem = {
    id: 1,
    name: 'Test',
    kind: 'creature'
}

test('new creatures map', () => {
    let existingTrackedCreatures = [];
    let queue = {
        items: [taleSpireQueueItem]
    }

    const actualResult = sut.remapCreatures(existingTrackedCreatures, queue);

    let expectedResult = [new trackedCreature(1, 'Test')];
    expect(actualResult).toEqual(expectedResult)
});

test('existing creatures stay mapped', () => {
    let existingTrackedCreatures = [new trackedCreature(1, 'Test')];
    let queue = {
        items: [taleSpireQueueItem]
    }

    const actualResult = sut.remapCreatures(existingTrackedCreatures, queue);

    expect(actualResult).toEqual(existingTrackedCreatures)
});

test('missing creatures are removed', () => {
    let existingTrackedCreatures = [new trackedCreature(1, 'Test')];
    let queue = {
        items: []
    }

    const actualResult = sut.remapCreatures(existingTrackedCreatures, queue);

    expect(actualResult).toEqual([])
});

test('when a turn increments from creature 0 to 1, then creature 0 buff durations go down by 1', () => {
    const creature0 = new trackedCreature(1, 'Test');
    creature0.addBuff(new buff('test buff', 2));

    const creature1 = new trackedCreature(1, 'Test');
    creature1.addBuff(new buff('test buff', 2));
    let existingTrackedCreatures = [creature0, creature1];

    sut.updateLastTurnCreature(existingTrackedCreatures, 1);
    
    expect(creature0.buffs[0].roundDuration).toEqual(1);
});
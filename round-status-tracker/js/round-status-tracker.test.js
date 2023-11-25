const creatureInitiativeItem = require('./creatureInitiativeItem');
const buff = require('./buff');
const roundStatusTracker = require('./round-status-tracker');

const taleSpireQueueItem = {
    id: 1,
    name: 'Test',
    kind: 'creature'
}

test('new creatures map', () => {
    let existingTrackedCreatures = [];
    let queue = {
        items: [
            taleSpireQueueItem
        ]
    }

    const actualResult = roundStatusTracker.remapCreatures(existingTrackedCreatures, queue);
    let expectedResult = [new creatureInitiativeItem(1, 'Test')];
    expect(actualResult).toEqual(expectedResult)
});

test('existing creatures stay mapped', () => {
    let existingTrackedCreatures = [new creatureInitiativeItem(1, 'Test')];
    let queue = {
        items: [
            taleSpireQueueItem
        ]
    }

    const actualResult = roundStatusTracker.remapCreatures(existingTrackedCreatures, queue);
    expect(actualResult).toEqual(existingTrackedCreatures)
});
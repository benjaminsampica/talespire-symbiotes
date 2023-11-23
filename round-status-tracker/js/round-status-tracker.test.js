const creatureInitiativeItem = require('./creatureInitiativeItem');
const buff = require('./buff');
const roundStatusTracker = require('./round-status-tracker');

test('new creatures map as expected', () => {
    let existingTrackedCreatures = [];
    let queue = {
        items: [
            {
                id: 1,
                name: 'Test'
            }
        ]
    }

    const actualResult = roundStatusTracker.remapCreatures(existingTrackedCreatures, queue);
    let expectedResult = [new creatureInitiativeItem(1, 'Test')];
    expect(actualResult).toEqual(expectedResult)
});
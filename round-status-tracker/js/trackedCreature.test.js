const TrackedCreature = require('./trackedCreature');
const Buff = require('./buff');

test('when a round is incremented, all buffs durations are decremented', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addBuff('Heroism');
    sut.addBuff('Heroism');

    sut.incrementRound();

    sut.buffs.forEach(b => {
        expect(b.roundDuration).toEqual(9);
    });
});

test('when a round is decremented, all buffs durations are incremented', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addBuff('Heroism');
    sut.addBuff('Heroism');

    sut.decrementRound();

    sut.buffs.forEach(b => {
        expect(b.roundDuration).toEqual(11);
    });
});

test('overwritten incremented buff duration is increased by 1', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addBuff('Heroism');

    sut.overrideIncrementBuff(0);

    expect(sut.buffs[0].roundDuration).toEqual(11);
});

test('overwritten decremented buff duration is decreased by 1', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addBuff('Heroism');

    sut.overrideDecrementBuff(0);

    expect(sut.buffs[0].roundDuration).toEqual(9);
});
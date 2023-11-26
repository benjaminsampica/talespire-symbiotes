const TrackedCreature = require('./trackedCreature');
const Buff = require('./buff');

test('when a round is incremented, all buffs durations are decremented', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addBuff(new Buff('test1', 1));
    sut.addBuff(new Buff('test2', 1));

    sut.incrementRound();

    sut.buffs.forEach(b => {
        expect(b.roundDuration).toEqual(0);
    });
});

test('when a round is decremented, all buffs durations are incremented', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addBuff(new Buff('test1', 1));
    sut.addBuff(new Buff('test2', 1));

    sut.decrementRound();

    sut.buffs.forEach(b => {
        expect(b.roundDuration).toEqual(2);
    });
});

test('overwritten incremented buff duration is increased by 1', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addBuff(new Buff('test1', 1));

    sut.overrideIncrementBuff(0);

    expect(sut.buffs[0].roundDuration).toEqual(2);
});

test('overwritten decremented buff duration is decreased by 1', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addBuff(new Buff('test1', 1));

    sut.overrideDecrementBuff(0);

    expect(sut.buffs[0].roundDuration).toEqual(0);
});
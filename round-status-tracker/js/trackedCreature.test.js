const trackedCreature = require('./trackedCreature');
const buff = require('./buff');

test('when a round is incremented, all buffs durations are decremented', () => {
    let sut = new trackedCreature(1, 'Test');
    sut.addBuff(new buff('test1', 1));
    sut.addBuff(new buff('test2', 1));

    sut.incrementRound();

    sut.buffs.forEach(b => {
        expect(b.roundDuration).toEqual(0);
    });
});

test('when a round is decremented, all buffs durations are incremented', () => {
    let sut = new trackedCreature(1, 'Test');
    sut.addBuff(new buff('test1', 1));
    sut.addBuff(new buff('test2', 1));

    sut.decrementRound();

    sut.buffs.forEach(b => {
        expect(b.roundDuration).toEqual(2);
    });
});
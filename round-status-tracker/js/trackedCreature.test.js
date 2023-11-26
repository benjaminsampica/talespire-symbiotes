import TrackedCreature from './trackedCreature';

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

test('conditions can be added', () => {
    let sut = new TrackedCreature(1, 'Test');

    sut.addCondition('Blinded');

    expect(sut.conditions).toHaveLength(1);
});

test('conditions cant be added twice', () => {
    let sut = new TrackedCreature(1, 'Test');
    
    sut.addCondition('Blinded');
    sut.addCondition('Blinded');

    expect(sut.conditions).toHaveLength(1);
});

test('conditions can be removed', () => {
    let sut = new TrackedCreature(1, 'Test');
    
    sut.addCondition('Blinded');
    sut.removeCondition('Blinded');

    expect(sut.conditions).toHaveLength(0);
});

test('buffs can be added', () => {
    let sut = new TrackedCreature(1, 'Test');

    sut.addBuff('Bless');

    expect(sut.buffs).toHaveLength(1);
});

test('buffs cant be added twice', () => {
    let sut = new TrackedCreature(1, 'Test');
    
    sut.addBuff('Bless');
    sut.addBuff('Bless');

    expect(sut.buffs).toHaveLength(1);
});

test('buffs can be removed', () => {
    let sut = new TrackedCreature(1, 'Test');
    
    sut.addBuff('Bless');
    sut.removeBuff('Bless');

    expect(sut.buffs).toHaveLength(0);
});


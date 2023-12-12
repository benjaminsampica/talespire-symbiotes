import TrackedCreature from './trackedCreature';

test('when a round is incremented, all effects durations are decremented', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addEffect('Heroism');
    sut.addEffect('Heroism');

    sut.incrementRound();

    sut.effects.forEach(b => {
        expect(b.roundDuration).toEqual(9);
    });
});

test('when a round is decremented, all effects durations are incremented', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addEffect('Heroism');
    sut.addEffect('Heroism');

    sut.decrementRound();

    sut.effects.forEach(b => {
        expect(b.roundDuration).toEqual(11);
    });
});

test('overwritten incremented effect duration is increased by 1', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addEffect('Heroism');

    sut.overrideIncrementEffect('Heroism');

    expect(sut.effects[0].roundDuration).toEqual(11);
});

test('overwritten decremented effect duration is decreased by 1', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.addEffect('Heroism');

    sut.overrideDecrementEffect('Heroism');

    expect(sut.effects[0].roundDuration).toEqual(9);
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

test('effects can be added', () => {
    let sut = new TrackedCreature(1, 'Test');

    sut.addEffect('Bless');

    expect(sut.effects).toHaveLength(1);
});

test('effects cant be added twice', () => {
    let sut = new TrackedCreature(1, 'Test');

    sut.addEffect('Bless');
    sut.addEffect('Bless');

    expect(sut.effects).toHaveLength(1);
});

test('effects can be removed', () => {
    let sut = new TrackedCreature(1, 'Test');

    sut.addEffect('Bless');
    sut.removeEffect('Bless');

    expect(sut.effects).toHaveLength(0);
});

test('given not concentrating, when toggling concentrating, then now concentrating', () => {
    let sut = new TrackedCreature(1, 'Test');

    sut.toggleConcentrating();

    expect(sut.concentrating).toBe(true);
});

test('given concentrating, when toggling concentrating, then no longer concentrating', () => {
    let sut = new TrackedCreature(1, 'Test');
    sut.concentrating = true;
    
    sut.toggleConcentrating();

    expect(sut.concentrating).toBe(false);
});
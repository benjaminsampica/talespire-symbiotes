import Effect from "./effect.js";

test('given 1 minute, then returns 10 rounds', () => {
    expect(Effect.minutesAsRounds(1)).toBe(10);
});

test('given a custom effect, then can be added and removed', () => {
    Effect.addCustomEffect('Test', 10);

    expect(Effect.customEffects.length).toBe(1);

    Effect.removeCustomEffect('Test');

    expect(Effect.customEffects.length).toBe(0);
});
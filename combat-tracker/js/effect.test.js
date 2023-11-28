import Effect from "./effect.js";

test('given 1 minute, then returns 10 rounds', () => {
    expect(Effect.minutesAsRounds(1)).toBe(10);
});
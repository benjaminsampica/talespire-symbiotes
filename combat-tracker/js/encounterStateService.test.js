/**
 * @jest-environment jsdom
 */

import EncounterStateService from "./encounterStateService.js";

test('given its the first creatures turn, when the turn is moved forward, then is not a new round and the round does not increment.', () => {
    const [isNewRound, isRoundIncrementing] = EncounterStateService.calculateNewRoundStatus(0, 1);

    expect(isNewRound).toEqual(false);
    expect(isRoundIncrementing).toEqual(false);
});

test('given its the last creatures turn, when the turn is moved forward, then is a new round and the round increments', () => {
    const [isNewRound, isRoundIncrementing] = EncounterStateService.calculateNewRoundStatus(2, 0);

    expect(isNewRound).toEqual(true);
    expect(isRoundIncrementing).toEqual(true);
});

test('given its the first creatures turn, when the turn is moved backward, then is a new round and the round is not incrementing', () => {
    const [isNewRound, isRoundIncrementing] = EncounterStateService.calculateNewRoundStatus(0, 2);

    expect(isNewRound).toEqual(true);
    expect(isRoundIncrementing).toEqual(false);
});

test('given a creature is removed from the board, when it was that creatures turn, then it is not a new round and the round is not incrementing', () => {
    const [isNewRound, isRoundIncrementing] = EncounterStateService.calculateNewRoundStatus(0, 0);

    expect(isNewRound).toEqual(false);
    expect(isRoundIncrementing).toEqual(false);
});
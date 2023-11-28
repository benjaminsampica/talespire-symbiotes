/**
 * @jest-environment jsdom
 */

import EncounterStateService from "./encounterStateService.js";

test('given the active index is 0, when it changes to 1, then is not a new round and is not round incrementing', () => {
    const [isNewRound, isRoundIncrementing] = EncounterStateService.calculateNewRoundStatus(0, 1);

    expect(isNewRound).toEqual(false);
    expect(isRoundIncrementing).toEqual(false);
});

test('given the active index is 2, when it changes to 0, then is a new round and the round is incrementing', () => {
    const [isNewRound, isRoundIncrementing] = EncounterStateService.calculateNewRoundStatus(2, 0);

    expect(isNewRound).toEqual(true);
    expect(isRoundIncrementing).toEqual(true);
});

test('given the active index is 0, when it changes to 2, then is a new round and the round is not incrementing', () => {
    const [isNewRound, isRoundIncrementing] = EncounterStateService.calculateNewRoundStatus(0, 2);

    expect(isNewRound).toEqual(true);
    expect(isRoundIncrementing).toEqual(false);
});
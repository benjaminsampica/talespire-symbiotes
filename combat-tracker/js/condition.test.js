import Condition from "./condition.js";

test('given a custom condition, then can be added and removed', () => {
    Condition.addCustomCondition('Test');

    expect(Condition.customConditions.length).toBe(1);

    Condition.removeCustomCondition('Test');

    expect(Condition.customConditions.length).toBe(0);
});
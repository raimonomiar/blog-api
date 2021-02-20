import { generateHash } from "../../src/shared/extensions";

test('generate - should return hash that matches the value.', () => {
    const result = generateHash('ayushs', '10');
    console.log(result);
    expect(result).toBe("abcdefgh###")
});
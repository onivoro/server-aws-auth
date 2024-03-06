import { convertObjectToAttributeList } from './convert-object-to-attribute-list.function';

describe('convertObjectToAttributeList', () => {
    it.each([
        null, undefined, '', 0
    ])('returns empty array for falsey values like => %j', (input) => {
        expect(convertObjectToAttributeList(input as any)).toEqual([]);
    });

    it.each([
        { email: null, phone: undefined, address: '', number: 0, age: 337 },
    ])('formats object to array, given %j', (input) => {
        expect(convertObjectToAttributeList(input as any)).toMatchSnapshot()
    });
});
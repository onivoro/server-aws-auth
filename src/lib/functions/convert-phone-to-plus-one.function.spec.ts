import { convertPhoneToPlusOne } from './convert-phone-to-plus-one.function';

describe('convertObjectToAttributes', () => {
    it.each([
        null, undefined, '', 0
    ])('returns empty string for falsey values like => %j', (input) => {
        expect(convertPhoneToPlusOne(input as any)).toEqual('');
    });

    it.each([
        '+17245459294', '724-545-9294', '7245459294', '(724) 545-9294', '+1(724) 545-9294'
    ])('removes dashes and prepends +1, given %j', (input) => {
        expect(convertPhoneToPlusOne(input as any)).toMatchSnapshot()
    });
});
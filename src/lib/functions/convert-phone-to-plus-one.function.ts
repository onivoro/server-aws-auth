const plusOne = '+1';
const nonDigitRegex = /\D/g;

export function convertPhoneToPlusOne(phone: string | number): string {
    if (!phone) {
        return '';
    }
    const justDigits = phone.toString().replace(plusOne, '').replace(nonDigitRegex, '');
    return `${plusOne}${justDigits}`
}
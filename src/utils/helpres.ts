
export function generateString (size: number): string {
    if (size <= 0) {
        return '';
    }

    return [...Array(Math.ceil(size / 11) - 1)]
        .reduce((str: string) => str.concat(Math.random().toString(36).substring(2, 13)), '')
        .concat(Math.random().toString(36).substring(2, ((size % 11) || size) + 2));
}



export const generateString2 = (s: number = 0): string => [...Array(Math.max((Math.ceil(s / 11) - 1), 0))]
        .reduce((str: string) => str.concat(Math.random().toString(36).substring(2, 13)), '')
        .concat(Math.random().toString(36).substring(2, Math.max((s % 11) || s, 0) + 2));


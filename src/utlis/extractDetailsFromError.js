export const extractDetailsFromError = (inputString) => {
    const match = inputString.match(/(Details: .*)|(Error: .*)/);
    if (match) {
        let result = match[0];
        // Determine which prefix was matched and replace it
        if (result.startsWith('Details: ')) {
            result = result.replace('Details: ', '');
        } else if (result.startsWith('Error: ')) {
            result = result.replace('Error: ', '');
        }
        // Remove parentheses and their contents
        result = result.replace(/\(.*?\)/g, '').trim();
        return result;
    }
    return 'something went wrong';
}
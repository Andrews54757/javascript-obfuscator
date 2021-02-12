/**
 * @returns {string}
 */
export function StringArrayTemplate (
    useFnWrapper: boolean
): string {
    if (useFnWrapper) {
        return `
            function {stringArrayName} () {
                return [{stringArrayStorageItems}];
            }
            {selfDefendingCode}
            {stringArrayName} = {stringArrayName}();
        `;
    } else {
        return `
            const {stringArrayName} = [{stringArrayStorageItems}];
            {selfDefendingCode}
        `;
    }
}

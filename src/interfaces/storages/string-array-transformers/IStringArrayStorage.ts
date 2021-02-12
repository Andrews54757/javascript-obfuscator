import { TStringArrayEncoding } from '../../../types/options/TStringArrayEncoding';

import { IMapStorage } from '../IMapStorage';
import { IStringArrayStorageItemData } from './IStringArrayStorageItem';

export interface IStringArrayStorage extends IMapStorage <string, IStringArrayStorageItemData> {
    /**
     * @returns {number}
     */
    getIndexShiftAmount (): number;

    /**
     * @returns {number}
     */
    getRotationAmount (): number;

    /**
     * @returns {string}
     */
    getHashName (): string;

    /**
     * @returns {number}
     */
    getHash (): number;

    /**
     * @returns {number}
     */
    getHashEntropy (): number;

    /**
     * @returns {string}
     */
    getStorageName (): string;

    /**
     * @returns {number}
     */
    getSecretValue (): number;

    /**
     * @param {TStringArrayEncoding | null} stringArrayEncoding
     * @returns {string}
     */
    getStorageCallsWrapperName (stringArrayEncoding: TStringArrayEncoding | null): string;

    rotateStorage (): void;

    shuffleStorage (): void;
}

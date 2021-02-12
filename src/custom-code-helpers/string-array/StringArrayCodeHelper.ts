import { inject, injectable, } from 'inversify';
import { ServiceIdentifiers } from '../../container/ServiceIdentifiers';

import { TIdentifierNamesGeneratorFactory } from '../../types/container/generators/TIdentifierNamesGeneratorFactory';
import { TStatement } from '../../types/node/TStatement';

import { ICustomCodeHelperFormatter } from '../../interfaces/custom-code-helpers/ICustomCodeHelperFormatter';
import { ICustomCodeHelperObfuscator } from '../../interfaces/custom-code-helpers/ICustomCodeHelperObfuscator';
import { IOptions } from '../../interfaces/options/IOptions';
import { IRandomGenerator } from '../../interfaces/utils/IRandomGenerator';
import { IStringArrayStorage } from '../../interfaces/storages/string-array-transformers/IStringArrayStorage';
import { IStringArrayStorageItemData } from '../../interfaces/storages/string-array-transformers/IStringArrayStorageItem';

import { initializable } from '../../decorators/Initializable';

import { StringArrayTemplate } from './templates/string-array/StringArrayTemplate';

import { AbstractCustomCodeHelper } from '../AbstractCustomCodeHelper';
import { NodeUtils } from '../../node/NodeUtils';
import { StringUtils } from '../../utils/StringUtils';
import { SelfDefendStringArrayTemplate } from './templates/string-array/SelfDefendStringArrayTemplate';

@injectable()
export class StringArrayCodeHelper extends AbstractCustomCodeHelper {
    /**
     * @type {IStringArrayStorage}
     */
    @initializable()
    private stringArrayStorage!: IStringArrayStorage;

    /**
     * @type {string}
     */
    @initializable()
    private stringArrayName!: string;

    /**
     * @param {TIdentifierNamesGeneratorFactory} identifierNamesGeneratorFactory
     * @param {ICustomCodeHelperFormatter} customCodeHelperFormatter
     * @param {ICustomCodeHelperObfuscator} customCodeHelperObfuscator
     * @param {IRandomGenerator} randomGenerator
     * @param {IOptions} options
     */
    public constructor (
        @inject(ServiceIdentifiers.Factory__IIdentifierNamesGenerator)
            identifierNamesGeneratorFactory: TIdentifierNamesGeneratorFactory,
        @inject(ServiceIdentifiers.ICustomCodeHelperFormatter) customCodeHelperFormatter: ICustomCodeHelperFormatter,
        @inject(ServiceIdentifiers.ICustomCodeHelperObfuscator) customCodeHelperObfuscator: ICustomCodeHelperObfuscator,
        @inject(ServiceIdentifiers.IRandomGenerator) randomGenerator: IRandomGenerator,
        @inject(ServiceIdentifiers.IOptions) options: IOptions
    ) {
        super(
            identifierNamesGeneratorFactory,
            customCodeHelperFormatter,
            customCodeHelperObfuscator,
            randomGenerator,
            options
        );
    }

    /**
     * @param {IStringArrayStorage} stringArrayStorage
     * @param {string} stringArrayName
     */
    public initialize (
        stringArrayStorage: IStringArrayStorage,
        stringArrayName: string
    ): void {
        this.stringArrayStorage = stringArrayStorage;
        this.stringArrayName = stringArrayName;
    }

    /**
     * @param {string} codeHelperTemplate
     * @returns {TStatement[]}
     */
    protected getNodeStructure (codeHelperTemplate: string): TStatement[] {
        return NodeUtils.convertCodeToStructure(codeHelperTemplate);
    }

    /**
     * @returns {string}
     */
    protected getCodeHelperTemplate (): string {
        let selfDefendingCode: string = '';
      

        if (this.options.stringArraySelfDefending) {
            selfDefendingCode = this.customCodeHelperFormatter.formatTemplate(SelfDefendStringArrayTemplate(
                this.randomGenerator,
                !this.options.rotateStringArray,
                this.stringArrayStorage.getHash(),
                this.stringArrayStorage.getHashEntropy(),
                this.stringArrayStorage.getSecretValue()
            ), {
                stringArrayName: this.stringArrayName,
                stringHashName: this.stringArrayStorage.getHashName()
            });
        }

        return this.customCodeHelperFormatter.formatTemplate(StringArrayTemplate(this.options.stringArraySelfDefending), {
            stringArrayName: this.stringArrayName,
            stringArrayStorageItems: this.getEncodedStringArrayStorageItems(),
            selfDefendingCode: selfDefendingCode
        });
    }

    /**
     * @returns {string}
     */
    private getEncodedStringArrayStorageItems (): string {
        return Array
            .from(this.stringArrayStorage.getStorage().values())
            .map((stringArrayStorageItemData: IStringArrayStorageItemData): string => {
                const escapedEncodedValue: string = StringUtils.escapeJsString(stringArrayStorageItemData.encodedValue);

                return `'${escapedEncodedValue}'`;
            })
            .toString();
    }
}

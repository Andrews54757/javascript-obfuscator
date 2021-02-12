import type { Expression } from 'estree';
import { inject, injectable, } from 'inversify';
import { ServiceIdentifiers } from '../../container/ServiceIdentifiers';

import { TIdentifierNamesGeneratorFactory } from '../../types/container/generators/TIdentifierNamesGeneratorFactory';
import { TStatement } from '../../types/node/TStatement';

import { ICustomCodeHelperFormatter } from '../../interfaces/custom-code-helpers/ICustomCodeHelperFormatter';
import { ICustomCodeHelperObfuscator } from '../../interfaces/custom-code-helpers/ICustomCodeHelperObfuscator';
import { IOptions } from '../../interfaces/options/IOptions';
import { IRandomGenerator } from '../../interfaces/utils/IRandomGenerator';

import { initializable } from '../../decorators/Initializable';

import { StringArrayRotateFunctionTemplate } from './templates/string-array-rotate-function/StringArrayRotateFunctionTemplate';

import { AbstractCustomCodeHelper } from '../AbstractCustomCodeHelper';
import { NodeUtils } from '../../node/NodeUtils';
import { IStringArrayStorage } from '../../interfaces/storages/string-array-transformers/IStringArrayStorage';

@injectable()
export class StringArrayRotateFunctionCodeHelper extends AbstractCustomCodeHelper {
    /**
     * @type {string}
     */
    @initializable()
    private comparisonValue!: number;

    /**
     * @type {Expression}
     */
    @initializable()
    private comparisonExpressionNode!: Expression;

    /**
     * @type {IStringArrayStorage}
     */
    private readonly stringArrayStorage: IStringArrayStorage;

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
        @inject(ServiceIdentifiers.IOptions) options: IOptions,
        @inject(ServiceIdentifiers.IStringArrayStorage) stringArrayStorage: IStringArrayStorage
    ) {
        super(
            identifierNamesGeneratorFactory,
            customCodeHelperFormatter,
            customCodeHelperObfuscator,
            randomGenerator,
            options
        );
        this.stringArrayStorage = stringArrayStorage;
    }

    /**
     * @param {string} stringArrayName
     * @param {number} comparisonValue
     * @param {Expression} comparisonExpressionNode
     */
    public initialize (
        comparisonValue: number,
        comparisonExpressionNode: Expression
    ): void {
        this.comparisonValue = comparisonValue;
        this.comparisonExpressionNode = comparisonExpressionNode;
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
        const comparisonExpressionCode: string = NodeUtils.convertStructureToCode([this.comparisonExpressionNode]);
        let compareString: string = this.comparisonValue.toString();
        
        if (this.options.stringArraySelfDefending) {
            const secret: number = this.stringArrayStorage.getSecretValue();
            const hashName: string = this.stringArrayStorage.getHashName();
            const random1: number = this.randomGenerator.getRandomInteger(0, 1e6);
            const random2: number = this.randomGenerator.getRandomInteger(0, 1e6);
            const calculated: number = (((secret ^ random1) << 5) - secret ^ random2) | 0;
            const diff: number = this.comparisonValue - calculated;
    
            compareString = `((((${hashName}^${random1}) << 5) - ${hashName}^${random2})|0)`;
            compareString += `${(Math.sign(diff) === -1 ? '-' : '+')}${Math.abs(diff)}`;
        }

        return this.customCodeHelperFormatter.formatTemplate(
            StringArrayRotateFunctionTemplate(),
            {
                comparisonExpressionCode,
                comparisonValue: compareString,
                stringArrayName: this.stringArrayStorage.getStorageName()
            }
        );
    }
}

import { IRandomGenerator } from '../../../../interfaces/utils/IRandomGenerator';

/**
 * @param {IRandomGenerator} randomGenerator
 * @param {string} hash
 * @returns {string}
 * @constructor
 */
export function SelfDefendStringArrayTemplate (
    randomGenerator: IRandomGenerator,
    doCheck: boolean,
    hash: number,
    hashEntropy: number,
    secret: number
): string {
    const identifierLength: number = 6;
    const hashVar: string = randomGenerator.getRandomString(identifierLength);
    const toHashVar: string = randomGenerator.getRandomString(identifierLength);
    const charVar: string = randomGenerator.getRandomString(identifierLength);
    const iteratorVar: string = randomGenerator.getRandomString(identifierLength);
    const iteratorVar2: string = randomGenerator.getRandomString(identifierLength);
    const strVar: string = randomGenerator.getRandomString(identifierLength);
    const hashFuncName: string = randomGenerator.getRandomString(identifierLength);
    const funcToString: string = randomGenerator.getRandomString(identifierLength);

  
    const random1: number = randomGenerator.getRandomInteger(0, 1e6);
    const random2: number = randomGenerator.getRandomInteger(0, 1e6);
    const calculated: number = (((hash ^ random1) << 5) - hash ^ random2) | 0;
    const diff: number = secret - calculated;

    return `
    var {stringHashName} = (function() {
        function ${hashFuncName}(${toHashVar}, ${iteratorVar}) {
            for (var ${hashVar} = 0,${iteratorVar2} = ${hashEntropy};${hashVar} ${doCheck ? '!' : '='}= ${doCheck ? hash : '0'}; ${iteratorVar2}++) {
                for (${hashVar} = ${toHashVar}['split']('\\n')['length']-1,${iteratorVar} = 0, ${toHashVar}=${funcToString}();${iteratorVar} < ${toHashVar}['length']; ${iteratorVar}++) {
                    var ${charVar} = ${toHashVar}['charCodeAt'](${iteratorVar}) ^ ${iteratorVar2};
                    ${hashVar} = ((${hashVar}<<(${iteratorVar2} ^ ${hashEntropy ^ 5}))-${hashVar})+${charVar};
                    ${hashVar} = ${hashVar} & ${hashVar};
                }
            }
            return ((((${hashVar}^${random1}) << 5) - ${hashVar}^${random2})|0)${(Math.sign(diff) === -1 ? '-' : '+')}${Math.abs(diff)};
        }
        function ${funcToString}() {
            var ${strVar} = {stringArrayName}['toString']()['replace'](/\\'/g,'')['trim']();
            return ${strVar}['substring'](${strVar}['indexOf']('[')-${funcToString}['toString']()['indexOf']('\\n'),${strVar}['lastIndexOf'](']'));
        }
        return ${hashFuncName}(${hashFuncName}['toString']());
    })();`;
}

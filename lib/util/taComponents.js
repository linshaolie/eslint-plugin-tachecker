/**
* @fileoverview Utility functions for checkedComponents setting
* @author linshaolie
*/
'use strict';

const DEFAULT_CHECKED_COMPONENTS = [
    'TouchableOpacity', 'TouchableWithoutFeedback',
    'TouchableHighlight','TouchableNativeFeedback',
    'QLoadingError',
    {name: 'Switch', funcName: 'onValueChange'}
];
const DEFAULT_FUNC_NAME = 'onPress';
const IGNORE_CHECK_IDENTIFIER_REGEX = /^\*\s*@ta\s+([^\s]+)/;

function getTAComponents(context, ignoreComment) {
    const sourceCode = context.getSourceCode();
    const taConfig = (context.settings || {}).tachecker || {};
    let {taComponents = []} = taConfig;
    const pragmaNode = sourceCode.getAllComments().find(node => IGNORE_CHECK_IDENTIFIER_REGEX.test(node.value));

    if (pragmaNode && !ignoreComment) {
        const matches = IGNORE_CHECK_IDENTIFIER_REGEX.exec(pragmaNode.value);
        const pragma = matches[1].split('.')[0];
        if (pragma === 'ignore') {
            return [];
        }
    }

    const map = new Map(DEFAULT_CHECKED_COMPONENTS.concat(taComponents).map(value => {
        if (typeof value === 'string') {
            return [value, DEFAULT_FUNC_NAME];
        }
        return [value.name, value.funcName,];
    }));
    return Array.from(map);
}

module.exports = {
    getTAComponents: getTAComponents
};

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

function getCheckedComponents(context, ignoreComment) {
    const sourceCode = context.getSourceCode();
    const taConfig = (context.settings || {}).tachecker || {};
    let {checkedComponents = [], taComponents = []} = taConfig;
    const pragmaNode = sourceCode.getAllComments().find(node => IGNORE_CHECK_IDENTIFIER_REGEX.test(node.value));

    if (pragmaNode && !ignoreComment) {
        const matches = IGNORE_CHECK_IDENTIFIER_REGEX.exec(pragmaNode.value);
        const pragma = matches[1].split('.')[0];
        if (pragma === 'ignore') {
            return [];
        }
    }

    taComponents = DEFAULT_CHECKED_COMPONENTS.concat(taComponents);
    const map = taComponents.concat(checkedComponents).map(value => {
        let isTaComponent = false;
        if (typeof value === 'string') {
            isTaComponent = taComponents.includes(value);
            return [value, DEFAULT_FUNC_NAME, isTaComponent];
        }
        isTaComponent = taComponents.includes(value.name);
        return [value.name, value.funcName, isTaComponent];
    });
    return map
}

module.exports = {
    getCheckedComponents: getCheckedComponents
};

/**
* @fileoverview Utility functions for checkedComponents setting
* @author linshaolie
*/
'use strict';

const DEFAULT_CHECKED_COMPONENTS = [
    'TouchableOpacity', 'TouchableWithoutFeedback',
    'TouchableHighlight','TouchableNativeFeedback'
];
const DEFAULT_FUNC_NAME = 'onPress';
const IGNORE_CHECK_IDENTIFIER_REGEX = /^\*\s*@ta\s+([^\s]+)/;

function getCheckedComponents(context, ignoreComment) {
    const sourceCode = context.getSourceCode();
    const settings = context.settings || {};
    const pragmaNode = sourceCode.getAllComments().find(node => IGNORE_CHECK_IDENTIFIER_REGEX.test(node.value));

    if (pragmaNode && !ignoreComment) {
        const matches = IGNORE_CHECK_IDENTIFIER_REGEX.exec(pragmaNode.value);
        const pragma = matches[1].split('.')[0];
        if (pragma === 'ignore') {
            return [];
        }
    }
    return Array.from(new Map(DEFAULT_CHECKED_COMPONENTS.concat(settings.checkedComponents || []).map(value => {
        if (typeof value === 'string') {
            return [value, DEFAULT_FUNC_NAME];
        }
        return [value.name, value.funcName];
    })));
}

module.exports = {
    getCheckedComponents: getCheckedComponents
};

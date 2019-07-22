/**
* @fileoverview Utility functions for React pragma configuration
* @author shaolie.lin
*/
'use strict';

// Does not check for reserved keywords or unicode characters
const JS_IDENTIFIER_REGEX = /^[_\-$a-zA-Z][_\-$a-zA-Z0-9]*$/;


function getFromContext(context) {
    let pragmas = ['TA'];

    const sourceCode = context.getSourceCode();
    // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
    if (context.settings.tachecker && context.settings.tachecker.pragmas) {
        pragmas = context.settings.tachecker.pragmas;
    }

    pragmas.forEach(pragma => {
        if (!JS_IDENTIFIER_REGEX.test(pragma)) {
            throw new Error(`TA pragma ${pragma} is not a valid identifier`);
        }
    });
    return pragmas;
}

module.exports = {
    getFromContext: getFromContext
};

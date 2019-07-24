/**
* @fileoverview taName名称是否存在检测
* @author linshaolie
*/

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const variableUtil = require('../util/variable');
const hasProp = require('jsx-ast-utils/hasProp');
const getPropValue = require('jsx-ast-utils/getPropValue');
const astUtil = require('jsx-ast-utils');
const pragmaUtil = require('../util/pragma');
const checkedComponentsUtil = require('../util/checkedComponents');
const docsUrl = require('../util/docsUrl');

module.exports = {
    meta: {
        docs: {
            description: "taName是否存在检测",
            category: "exist-taname-checker",
            url: docsUrl('exist-taname-checker'),
            recommended: false
        },
        fixable: "code",
        schema: []
    },

    create: ((context) => {
        const pragmas = pragmaUtil.getFromContext(context);
        const checkedComponents = checkedComponentsUtil.getCheckedComponents(context);

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------
        function randomString() {
            const expect = 16;

            let str = new Date().getTime().toString(36);
            while (str.length < expect) {
                str += Math.random().toString(36).substring(2);
            }
            return str.substring(0, expect);
        }

        function getVariableSourceValue(variable) {
            return variable.identifiers && variable.identifiers[0].parent.parent.source && variable.identifiers[0].parent.parent.source.value;
        }

        function checkIfTaNameExist(node) {
            const NOT_TANAME_MESSAGE = 'taName不存在';

            const variables = variableUtil.variablesInScope(context);
            for (let [comName, funcName] of checkedComponents) {
                if (variableUtil.findVariable(variables, comName)) {
                    const variable = variableUtil.getVariable(variables, comName);
                    if (pragmas.includes(getVariableSourceValue(variable))) {
                        if (node.name.name === comName) {
                            if (hasProp(node.attributes, 'taName') || !hasProp(node.attributes, funcName)) {
                                return;
                            }

                            context.report({
                                node,
                                message: NOT_TANAME_MESSAGE,
                                fix: function (fixer) {
                                    const taName = randomString();
                                    // test
                                    // const taName = 'abc';
                                    if (node.attributes.length > 0) {
                                        const attributes = node.attributes.slice(0);
                                        if (attributes) {
                                            return fixer.insertTextBeforeRange(attributes[0].range, `taName={'${taName}'} `);
                                        }
                                    } else {
                                        return fixer.insertTextBeforeRange([node.end - 1, node.end], ` taName={'${taName}'} `);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        return {
            JSXOpeningElement: checkIfTaNameExist,
            JSXOpeningFragment: checkIfTaNameExist
        };
    })
};

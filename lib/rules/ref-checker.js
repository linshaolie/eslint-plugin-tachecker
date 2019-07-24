/**
* @fileoverview TA组件 ref 检测
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
            description: "TA组件不能使用ref，需要用taRef代替",
            category: "ref-checker",
            url: docsUrl('ref-checker'),
            recommended: false
        },
        fixable: "code",
        schema: []
    },

    create: ((context) => {
        const pragmas = pragmaUtil.getFromContext(context);
        const checkedComponents = checkedComponentsUtil.getCheckedComponents(context, true);
        const variables = variableUtil.variablesInScope(context);
        const sourceCode = context.getSourceCode();
        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        function report(node) {
            const TIPS_MESSAGE = '请使用taRef替代ref';
            context.report({
                node,
                message: TIPS_MESSAGE,
                fix: function (fixer) {
                    return fixer.replaceText(node, sourceCode.getText(node).replace('ref', 'taRef'));
                }
            });
        }

        function checkHasRef(node) {
            for (let [comName, funcName] of checkedComponents) {
                if (node.name.name === comName && hasProp(node.attributes, 'ref')) {
                    if (variableUtil.findVariable(variables, comName)) {
                        const variable = variableUtil.getVariable(variables, comName);

                        if (variableUtil.isVariable(variable) && variableUtil.getVariableType(variable) === 'CallExpression') {
                            if (pragmas.includes(variableUtil.getCallExpressionValue(variable))) {
                                report(node);
                            }
                        } else if (variableUtil.isImportBinding(variable)) {
                            if (variable.identifiers && pragmas.includes(variableUtil.getImportBindingSourceValue(variable))) {
                                return report(node);
                            }
                        }
                    }
                }
            }
        }
        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        return {
            JSXOpeningElement: checkHasRef,
            JSXOpeningFragment: checkHasRef
        };
    })
};

/**
* @fileoverview 强制引入TA组件检测
* @author linshaolie
*/


"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const variableUtil = require('../util/variable');
const astUtil = require('jsx-ast-utils');
const pragmaUtil = require('../util/pragma');
const checkedComponentsUtil = require('../util/checkedComponents');
const docsUrl = require('../util/docsUrl');

module.exports = {
    meta: {
        docs: {
            description: "强制引入TA组件检测",
            category: "force-import-ta-component",
            url: docsUrl('force-import-ta-component'),
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

        function report(comName, loc) {
            context.report({
                // node,
                loc: loc,
                message: `请使用${pragmas.join('、')}下的${comName}组件`
            });
        }

        function getNodeCallExpressionValue(node) {
            return node.parent.declarations[0].init.arguments[0].value;
        }

        function checkIsTaComponent(node) {
            const variables = context.getDeclaredVariables(node);
            for (let [comName, funcName] of checkedComponents) {
                if (variableUtil.findVariable(variables, comName)) {
                    const variable = variableUtil.getVariable(variables, comName);

                    if (variableUtil.isVariable(variable) && variableUtil.getVariableType(variable) === 'CallExpression') {
                        if (!pragmas.includes(getNodeCallExpressionValue(node))) {
                            report(comName, variableUtil.getVariableLoc(variable));
                        }
                    }
                    else if (variableUtil.isImportBinding(variable)) {
                        // console.log('---variable---', variable.identifiers[0].parent.parent.source);
                        if (variable.identifiers && !pragmas.includes(variableUtil.getImportBindingSourceValue(variable))) {
                            return report(comName, variableUtil.getVariableLoc(variable));
                        }
                    }
                }
            }
        }
        // checkIsTaComponent();
        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        return {
            VariableDeclarator: checkIsTaComponent,
            // VariableDeclaration: checkIsTaComponent,
            // ImportDeclaration: checkIsTaComponent,
            ImportSpecifier: checkIsTaComponent,
            ImportDefaultSpecifier: checkIsTaComponent,
        };
    })
};

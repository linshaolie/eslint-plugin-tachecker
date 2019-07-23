/**
* @Author: 少烈 <shaolie>
* @Date:   2019-07-23T12:10:12+08:00
* @Email:  lshaolie@163.com
* @Filename: force-import-ta-component.js
* @Last modified by:   shaolie
* @Last modified time: 2019-07-23T16:42:03+08:00
* @License: Please contact me if you find any bugs 🐜^*^
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

        function isVariable(variable) {
            return variable.defs[0].type === 'Variable';
        }

        function isImportBinding(variable) {
            return variable.defs[0].type === 'ImportBinding';
        }

        function getVariableType(variable) {
            return variable.defs[0].node.init && variable.defs[0].node.init.type;
        }

        function getNodeCallExpressionValue(node) {
            return node.parent.declarations[0].init.arguments[0].value;
        }

        function getImportBindingSourceValue(variable) {
            return variable.identifiers[0].parent.parent.source && variable.identifiers[0].parent.parent.source.value;
        }

        function getVariableLoc(variable) {
            return variable.identifiers[0].loc;
        }

        function checkIsTaComponent(node) {
            const variables = context.getDeclaredVariables(node);
            for (let [comName, funcName] of checkedComponents) {
                if (variableUtil.findVariable(variables, comName)) {
                    const variable = variableUtil.getVariable(variables, comName);

                    if (isVariable(variable) && getVariableType(variable) === 'CallExpression') {
                        if (!pragmas.includes(getNodeCallExpressionValue(node))) {
                            report(comName, getVariableLoc(variable));
                        }
                    }
                    else if (isImportBinding(variable)) {
                        // console.log('---variable---', variable.identifiers[0].parent.parent.source);
                        if (variable.identifiers && !pragmas.includes(getImportBindingSourceValue(variable))) {
                            return report(comName, getVariableLoc(variable));
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

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
const taComponentsUtil = require('../util/taComponents');
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
        const taComponents = taComponentsUtil.getTAComponents(context);

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

        function fix(node, taComponentsFromReact, fixer) {
            let sourceCode = context.getSourceCode().getText(node);
            let importStartIndex = sourceCode.indexOf('{') + 1;
            let importEndIndex = sourceCode.indexOf('}')
            let imports = sourceCode.substring(importStartIndex , importEndIndex).split(',');
            // console.info('imports = ', imports);
            let newImports = [];
            imports.forEach(importObj => {
                if(taComponentsFromReact.indexOf(importObj.trim()) === -1){
                    newImports.push(importObj.trim());
                }
            });
            let taImportsRes = taComponentsFromReact.join(', ');
            let taImportNodeStr = `\nimport { ${taImportsRes} } from '${pragmas[0]}';`
            let fixedRes = [];
            fixedRes.push(fixer.insertTextAfter(node, taImportNodeStr));
            if(newImports.length === 0){
                let newSourceCode = sourceCode.replace(imports, '{}');
                if(newSourceCode.indexOf(',') === -1){
                    fixedRes.push(fixer.remove(node));
                }else {
                    let tmp = newSourceCode.split(',');
                    tmp.forEach((t) => {
                        let newStr = t.replace('{}', '');
                        if(newStr){
                            newSourceCode = ', ' + newStr;
                        }
                    });
                    fixedRes.push(fixer.replaceText(node, newSourceCode));
                }
            } else {
                let newImportsRes = newImports.join(', ');
                let newSourceCode = sourceCode.replace(imports, `${newImportsRes}`);
                fixedRes.push(fixer.replaceText(node, newSourceCode));
            }
            return fixedRes;
        }

        function getNodeCallExpressionValue(node) {
            return node.parent.declarations[0].init.arguments[0].value;
        }

        function checkIsTaComponent(node) {
            const variables = context.getDeclaredVariables(node);
            for (let [comName, funcName] of taComponents) {
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

        function forceImportComponentsFromTA(node) {
            const source = node.source.value;
            if(source === 'react-native'){
                let sourceCode = context.getSourceCode().getText(node);
                // console.log('sourceCode', sourceCode);
                let taComponentsFromReact = [];
                taComponents.forEach(([comName, funcName]) => {
                    if(sourceCode.indexOf(comName) !== -1){
                        taComponentsFromReact.push(comName);
                    }
                });
                if(taComponentsFromReact.length > 0){
                    let promotion = taComponentsFromReact.join('、');
                    context.report({
                        loc: node.loc,
                        message: `请使用${pragmas.join('、')}下的${promotion}组件`,
                        fix: (fixer) => {
                            return fix(node, taComponentsFromReact, fixer);
                        }
                    });
                }
            }
        }

        function forcereqiureComponentsFromTA(node) {
            let sourceCode = context.getSourceCode().getText(node);
            if (!node.source && sourceCode.indexOf('react-native') !== -1) {
                // console.log('sourceCode', sourceCode);
                let taComponentsFromReact = [];
                taComponents.forEach(([comName, funcName]) => {
                    if(sourceCode.indexOf(comName) !== -1){
                        taComponentsFromReact.push(comName);
                    }
                });
                if(taComponentsFromReact.length > 0){
                    let promotion = taComponentsFromReact.join('、');
                    context.report({
                        loc: node.loc,
                        message: `请使用${pragmas.join('、')}下的${promotion}组件`,
                        fix: (fixer) => {
                            return fix(node, taComponentsFromReact, fixer);
                        }
                    });
                }
            }
            else if (!node.source && sourceCode.indexOf('react-native') === -1) {
                checkIsTaComponent(node.declarations[0]);
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        return {
            // VariableDeclarator: checkIsTaComponent,
            VariableDeclaration: forcereqiureComponentsFromTA,
            ImportDeclaration: forceImportComponentsFromTA,
            // ImportSpecifier: checkIsTaComponent,
            ImportDefaultSpecifier: checkIsTaComponent,
        };
    })
};

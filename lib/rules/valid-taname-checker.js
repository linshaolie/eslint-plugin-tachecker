/**
 * @fileoverview taName名称有效性检测
 * @author linshaolie
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const hasProp = require('jsx-ast-utils/hasProp');
const getPropValue = require('jsx-ast-utils/getPropValue');
const {getProp} = require('jsx-ast-utils');
const docsUrl = require('../util/docsUrl');

module.exports = {
    meta: {
        docs: {
            description: "taName名称检测",
            category: "valid-taname-checker",
            url: docsUrl('valid-taname-checker'),
            recommended: false
        },
        fixable: "code",  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        const sourceCode = context.getSourceCode();

        function reportIfInvalid(node, value) {
            if (!isValidTaName(value)) {
                report(node, value);
                return true;
            }
            return false;
        }

        function isValidTaName(value) {
            const reg = /^[a-z1-9]+[a-z0-9_]+$/;
            return reg.test(value);
        }

        function report(node, value, canFix = true) {
            context.report({
                node,
                message: 'taName必须使用全小写字母用下划线隔开(如：abc_efg)',
                fix: canFix ? function(fixer) {
                    // const rst = fixer.insertTextAfter(lastToken, ";");
                    let rstValue = value.replace(/[A-Z]/g, function(m, idx) {
                        if (idx == 0) {
                            return m.toLowerCase();
                        }
                        return "_" + m.toLowerCase();
                    });
                    let rst = fixer.replaceText(node, sourceCode.getText(node).replace(value, rstValue));
                    // console.log('---fixe', rst.text);
                    return rst;
                } : undefined
            });
        }

        function checkTemplateLiteral(node, tl) {
            const value = tl.quasis.map(quasi => quasi.value.raw).join('');

            for (let expr of tl.expressions) {
                if (expr.type === 'ConditionalExpression') {
                    checkConditionalExpression(node, expr);
                }
            }
            if (!isValidTaName(value)) {
                report(node, value, false);
            }
        }

        function checkConditionalExpression(node, expr) {
            if (expr.consequent.type === 'ConditionalExpression') {
                checkConditionalExpression(node, expr.consequent);
            }
            if (expr.consequent.type === 'Literal') {
                if(reportIfInvalid(node, expr.consequent.value)) {
                    return;
                }
            }

            if (expr.alternate.type === 'ConditionalExpression') {
                checkConditionalExpression(node, expr.alternate);
            }
            if (expr.alternate.type === 'Literal') {
                if(reportIfInvalid(node, expr.alternate.value)) {
                    return;
                }
            }
        }

        return {
            VariableDeclaration(node) {
                for (let declaration of node.declarations) {
                    if (declaration.id.name === 'taName') {
                        if (declaration.init.type == 'Literal') {
                            reportIfInvalid(node, declaration.init.value);
                        }
                    }
                }
            },

            JSXElement(node) {
                if (!hasProp(node.openingElement.attributes, 'taName')) {
                    return;
                }
                const lastToken = sourceCode.getLastToken(node);

                const prop = getProp(node.openingElement.attributes, 'taName')
                if (prop.value.expression.type == 'TemplateLiteral') {
                    checkTemplateLiteral(node, prop.value.expression);
                } else if (prop.value.expression.type === 'Literal') {
                    reportIfInvalid(node, getPropValue(prop));
                } else if (prop.value.expression.type === 'ConditionalExpression') {
                    checkConditionalExpression(node, prop.value.expression);
                } else if (prop.value.expression.type === 'Identifier') {
                    const value = getPropValue(prop);
                    if (value !== 'taName') {
                        context.report({
                            node,
                            message: '请使用taName作为变量名'
                        });
                    }
                }
                else {
                    // console.log('prop.value.expression.type', prop.value.expression.type)
                    context.report({
                        node,
                        message: '建议使用常量定义taName',
                    })
                }
            },

        };
    }
};

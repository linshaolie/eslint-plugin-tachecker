/**
* @fileoverview 强制引入TA组件检测
* @author linshaolie
*/

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/force-import-ta-component"),
RuleTester = require("eslint").RuleTester;
// const parsers = require('../../helpers/parsers');

const parserOptions = {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
        experimentalObjectRestSpread: true,
        jsx: true
    }
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run("force-import-ta-component", rule, {

    valid: [
        {
            code: "<div></div>"
        },
        {
            code: 'var App, a = <App />;'
        },
        {
            code: 'var TouchableWithoutFeedback, a = <App />;'
        },
        {
            code: 'var TouchableWithoutFeedback = Com;'
        },
        {
            code:
            `import {TouchableWithoutFeedback} from 'TA';
            export default class Hello extends React.Component {
              render() {
                  const TouchableOpacity = 'abc';
                return (
                    <TouchableWithoutFeedback>
                    </TouchableWithoutFeedback>
                );
              }
            }`
        },
        {
            code:
            `const {TouchableWithoutFeedback} = require('TA');
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableWithoutFeedback>
                    </TouchableWithoutFeedback>
                );
              }
            }`
        },
        {
            code:
            `import {TouchableOpacity} from 'TA';
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableOpacity>
                    </TouchableOpacity>
                );
              }
            }`
        },
        {
            code:
            `import {TouchableHighlight} from 'TA';
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableHighlight>
                    </TouchableHighlight>
                );
              }
            }`
        },
        {
            code:
            `/** @ta ignore */
            import {View, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
            export default class Hello extends React.Component {
              render() {
                return (
                    <View>
                        <TouchableWithoutFeedback>
                        </TouchableWithoutFeedback>
                        <TouchableHighlight>
                        </TouchableHighlight>
                    </View>
                );
              }
            }`
        },
    ],

    invalid: [
        {
            code: 'import {TouchableWithoutFeedback} from \'react-native\';',
            errors: [{message: '请使用TA下的TouchableWithoutFeedback组件'}]
        },
        {
            code: 'import TouchableWithoutFeedback from \'TouchableWithoutFeedback\';',
            errors: [{message: '请使用TA下的TouchableWithoutFeedback组件'}]
        },
        {
            code:`const TouchableWithoutFeedback = require('TouchableWithoutFeedback');`,
            errors: [{message: '请使用TA下的TouchableWithoutFeedback组件'}]
        },
        {
            code: `const {TouchableWithoutFeedback} = require('react-native');`,
            errors: [{message: '请使用TA下的TouchableWithoutFeedback组件'}]
        },
        {
            code: `const {TouchableOpacity, TouchableWithoutFeedback} = require('react-native');`,
            errors: [
                {message: '请使用TA下的TouchableOpacity组件'},
                {message: '请使用TA下的TouchableWithoutFeedback组件'}
            ]
        },
        {
            code: `import {TouchableOpacity} from 'react-native';`,
            errors: [{message: '请使用TA下的TouchableOpacity组件'}]
        },
        {
            code: `import {TouchableWithoutFeedback, TouchableOpacity} from 'react-native';`,
            errors: [
                {message: '请使用TA下的TouchableWithoutFeedback组件'},
                {message: '请使用TA下的TouchableOpacity组件'}
            ]
        }
    ]
});

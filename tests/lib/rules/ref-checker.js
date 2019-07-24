/**
* @fileoverview TA组件 ref 检测
* @author linshaolie
*/

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ref-checker"),
RuleTester = require("eslint").RuleTester;

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
ruleTester.run("ref-checker", rule, {

    valid: [
        {
            code: "<div></div>"
        },
        {
            code: 'var App, a = <App />;'
        },
        {code:
            `import {TouchableWithoutFeedback} from 'TA';
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableWithoutFeedback taRef={() => {}}>
                        <View>
                            <Text>test</Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
              }
            }`
        },
        {code:
            `import TouchableWithoutFeedback from 'TouchableWithoutFeedback';
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableWithoutFeedback ref={() => {}}>
                        <View>
                            <Text>test</Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
              }
            }`
        },
        {code:
            `import {TouchableWithoutFeedback} from 'react-native';
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableWithoutFeedback ref={() => {}}>
                        <View>
                            <Text>test</Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
              }
            }`
        },
        {code:
            `const {TouchableOpacity} = require('react-native');
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableOpacity ref={(ref) => {this._touch = ref;}}>
                        <View>
                            <Text>test</Text>
                        </View>
                    </TouchableOpacity>
                );
              }
            }`
        },
        {code:
            `const TouchableOpacity = require('TouchableOpacity');
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableOpacity ref={(ref) => {this._touch = ref;}}>
                        <View>
                            <Text>test</Text>
                        </View>
                    </TouchableOpacity>
                );
              }
            }`
        },
        {code:
            `const {TouchableOpacity} = require('TA');
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableOpacity taRef={(ref) => {this._touch = ref;}}>
                        <View>
                            <Text>test</Text>
                        </View>
                    </TouchableOpacity>
                );
              }
            }`
        },
        {code:
            `import {Modal} from 'TA';
            export default class Hello extends React.Component {
              render() {
                return (
                    <Modal taRef={(m) => {this._modal = m;}} onPress={() => {}}>
                        <View>
                            <Text>test</Text>
                        </View>
                    </Modal>
                );
              }
            }`
        },
    ],

    invalid: [
        {code:
            `import {TouchableWithoutFeedback} from 'TA';
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableWithoutFeedback ref={(r) => {this._touch = r;}} onPress={() => {}}>
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            output:
            `import {TouchableWithoutFeedback} from 'TA';
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableWithoutFeedback taRef={(r) => {this._touch = r;}} onPress={() => {}}>
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            errors: ["请使用taRef替代ref"]
        },
        {code:
            `const {TouchableWithoutFeedback} = require('TA');
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableWithoutFeedback
                            ref={(ref) => {this._t = ref;}}
                        >
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            output:
            `const {TouchableWithoutFeedback} = require('TA');
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableWithoutFeedback
                            taRef={(ref) => {this._t = ref;}}
                        >
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            errors: ["请使用taRef替代ref"]
        },
        {code:
            `/** @ta ignore */
            const {TouchableWithoutFeedback} = require('TA');
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableWithoutFeedback
                            ref={(ref) => {this._t = ref;}}
                        >
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            output:
            `/** @ta ignore */
            const {TouchableWithoutFeedback} = require('TA');
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableWithoutFeedback
                            taRef={(ref) => {this._t = ref;}}
                        >
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            errors: ["请使用taRef替代ref"]
        }
    ]
});

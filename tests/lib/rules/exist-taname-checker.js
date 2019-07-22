/**
* @fileoverview taName名称是否存在检测
* @author 少烈 <shaolie>
*/

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/exist-taname-checker"),
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
ruleTester.run("exist-taname-checker", rule, {

    valid: [
        {
            code: "<div></div>"
        },
        {
            code: 'var App, a = <App />;'
        },
        {code:
            `import TA, {TouchableWithoutFeedback} from 'TA';
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableWithoutFeedback onPress={() => {}} taName={'submit_btn'}>
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
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View>
                            <Text>test</Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
              }
            }`
        },
        {code:
            `/** @ta ignore */
            import {TouchableWithoutFeedback} from 'TA';
            export default class Hello extends React.Component {
              render() {
                return (
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View>
                            <Text>test</Text>
                        </View>
                    </TouchableWithoutFeedback>
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
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View>
                                <Text>test</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            output:
            `import {TouchableWithoutFeedback} from 'TA';
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableWithoutFeedback taName={'abc'} onPress={() => {}}>
                            <View>
                                <Text>test</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            errors: ["taName不存在"]
        },
        {code:
            `import {TouchableWithoutFeedback} from 'TA';
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableWithoutFeedback
                            onPress={() => {}}
                        >
                            <View>
                                <Text>test</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            output:
            `import {TouchableWithoutFeedback} from 'TA';
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableWithoutFeedback
                            taName={'abc'} onPress={() => {}}
                        >
                            <View>
                                <Text>test</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }
            }`,
            errors: ["taName不存在"]
        },
        {code:
            `import {TouchableOpacity} from 'TA';
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableOpacity onPress={() => {}} style={styles.container}>
                            <View>
                                <Text>test</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }
            }`,
        output:
            `import {TouchableOpacity} from 'TA';
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableOpacity taName={'abc'} onPress={() => {}} style={styles.container}>
                            <View>
                                <Text>test</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }
            }`,
            errors: ["taName不存在"]
        },
        {code:
            `import {TouchableOpacity} from 'TA';
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableOpacity
                            onPress={() => {}}
                            style={styles.container}
                        >
                            <View>
                                <Text>test</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }
            }`,
        output:
            `import {TouchableOpacity} from 'TA';
            export default class Hello extends React.Component {
                render() {
                    return (
                        <TouchableOpacity
                            taName={'abc'} onPress={() => {}}
                            style={styles.container}
                        >
                            <View>
                                <Text>test</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }
            }`,
            errors: ["taName不存在"]
        }
    ]
});

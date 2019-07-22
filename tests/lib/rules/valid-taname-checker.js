/**
* @fileoverview taName名称有效性检测
* @author shaolie.lin
*/
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/valid-taname-checker"),
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
ruleTester.run("valid-taname-checker", rule, {

    valid: [
        {code: "fn()"},
        {code: `<div></div>`},
        {code: "<div onPress={() => {}} taName={'click_search'}></div>"},
        {code:
            `export default class Hello extends React.Component {
              render() {
                return <div taName={'submit_btn'}></div>;
              }
            }`
        },
        {
            code:
                `export default class Hello extends React.Component {
                  render() {
                      const taName = 'submit_btn1', test = 'abc';
                      const name = 'submit_btn2';
                    return <div taName={taName}></div>;
                  }
                }`
        },
        {
            code:
                "export default class Hello extends React.Component {\n" +
                "  render() {\n" +
                "      const taName = 'model', test = 'abc';\n" +
                    "return <div taName={`time_${taName}_${test}_cancle`}></div>;\n" +
                  "}\n" +
              "}"
        },
        {
            code:
                "export default class Hello extends React.Component {\n" +
                "  render() {\n" +
                "      const Flag = true;\n" +
                    "return <div taName={Flag ? 'modal_test' : 'test_modal'}></div>;\n" +
                  "}\n" +
                "}"
        },
        {
            code:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? 'dep' : 'arr'}`}></div>;\n" +
              "}\n" +
            "}"
        },
        {
            code:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? (1 ? 'dpt' : 'dep') : 'arr'}`}></div>;\n" +
              "}\n" +
            "}"
        },
        {
            code:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? 'dep' : (0 ? 'arrival' : 'arr')}`}></div>;\n" +
              "}\n" +
            "}"
        }
    ],

    invalid: [
        {
            code: "<div onPress={() => {}} taName={'Click_search'}></div>",
            output: "<div onPress={() => {}} taName={'click_search'}></div>",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
                `export default class Hello extends React.Component {
                  render() {
                    return <div taName={'clickSearch'}></div>;
                  }
                }`,
            output:
                `export default class Hello extends React.Component {
                  render() {
                    return <div taName={'click_search'}></div>;
                  }
                }`,
            // parser: parsers.BABEL_ESLINT,
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
                `export default class Hello extends React.Component {
                  render() {
                    return <div taName={'submitOrder'}></div>;
                  }
                }`,
            output:
                `export default class Hello extends React.Component {
                  render() {
                    return <div taName={'submit_order'}></div>;
                  }
                }`,
            // parser: parsers.BABEL_ESLINT,
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
                `export default class Hello extends React.Component {
                  render() {
                      const Name = 'submitOrder'
                    return <div taName={Name}></div>;
                  }
                }`,
            code:
                `export default class Hello extends React.Component {
                  render() {
                      const Name = 'submitOrder'
                    return <div taName={Name}></div>;
                  }
                }`,
            errors: ["请使用taName作为变量名"]
        },
        {
            code:
                "export default class Hello extends React.Component {\n" +
                "  render() {\n" +
                "      const taName = 'Model', test = 'abc';\n" +
                    "return <div taName={`time_${taName}_${test}_cancle`}></div>;\n" +
                  "}\n" +
                "}",
            output:
                "export default class Hello extends React.Component {\n" +
                "  render() {\n" +
                "      const taName = 'model', test = 'abc';\n" +
                    "return <div taName={`time_${taName}_${test}_cancle`}></div>;\n" +
                  "}\n" +
                "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
                "export default class Hello extends React.Component {\n" +
                "  render() {\n" +
                "      const taName = 'model', test = 'abc';\n" +
                    "return <div taName={`Time_${taName}_${test}_cancle`}></div>;\n" +
                  "}\n" +
                "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
                "export default class Hello extends React.Component {\n" +
                "  render() {\n" +
                "      const flag = true;\n" +
                    "return <div taName={flag ? 'Modal_test' : 'test_modal'}></div>;\n" +
                  "}\n" +
                "}",
            output:
                "export default class Hello extends React.Component {\n" +
                "  render() {\n" +
                "      const flag = true;\n" +
                    "return <div taName={flag ? 'modal_test' : 'test_modal'}></div>;\n" +
                  "}\n" +
                "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
                "export default class Hello extends React.Component {\n" +
                "  render() {\n" +
                "      const flag = true;\n" +
                    "return <div taName={flag ? 'modal_test' : 'Test_modal'}></div>;\n" +
                  "}\n" +
                "}",
            output:
                "export default class Hello extends React.Component {\n" +
                "  render() {\n" +
                "      const flag = true;\n" +
                    "return <div taName={flag ? 'modal_test' : 'test_modal'}></div>;\n" +
                  "}\n" +
                "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? 'Dep' : 'arr'}`}></div>;\n" +
              "}\n" +
            "}",
            output:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? 'dep' : 'arr'}`}></div>;\n" +
              "}\n" +
            "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? (1 ? 'dpt' : 'Dep') : 'arr'}`}></div>;\n" +
              "}\n" +
            "}",
            output:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? (1 ? 'dpt' : 'dep') : 'arr'}`}></div>;\n" +
              "}\n" +
            "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? (1 ? 'Dpt' : 'dep') : 'arr'}`}></div>;\n" +
              "}\n" +
            "}",
            output:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? (1 ? 'dpt' : 'dep') : 'arr'}`}></div>;\n" +
              "}\n" +
            "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? (1 ? 'dpt' : 'dep') : 'Arr'}`}></div>;\n" +
              "}\n" +
            "}",
            output:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = false;\n" +
                "return <div taName={`city_switch_cell_${Flag ? (1 ? 'dpt' : 'dep') : 'arr'}`}></div>;\n" +
              "}\n" +
            "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "     const Flag = false;\n" +
            "     return <div taName={`city_switch_cell_${Flag ? 'dep' : (0 ? 'Arrival' : 'arr')}`}></div>;\n" +
              "}\n" +
            "}",
            output:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "     const Flag = false;\n" +
            "     return <div taName={`city_switch_cell_${Flag ? 'dep' : (0 ? 'arrival' : 'arr')}`}></div>;\n" +
              "}\n" +
            "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        },
        {
            code:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = <div taName={'City_switch_cell'}/>\n" +
            "      return Flag;\n" +
              "}\n" +
            "}",
            output:
            "export default class Hello extends React.Component {\n" +
            "  render() {\n" +
            "      const Flag = <div taName={'city_switch_cell'}/>\n" +
            "      return Flag;\n" +
              "}\n" +
            "}",
            errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        }
        // {
        //     code:
        //         "export default class Hello extends React.Component {\n" +
        //         "  render() {\n" +
        //         "      const name = 'model', test = 'abc';\n" +
        //             "return <div taName={`time_${name}_${test}_cancle`}></div>;\n" +
        //           "}\n" +
        //       "}",
        //       errors: ["taName必须使用全小写字母用下划线隔开(如：abc_efg)"]
        // }
    ]
});

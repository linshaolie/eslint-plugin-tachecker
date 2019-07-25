# eslint-plugin-tachecker

&#34;TA 埋点框架规则检验&#34;

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-tachecker`:

```
$ npm install eslint-plugin-tachecker --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-tachecker` globally.

## Configuration

You should also specify settings that will be shared across all the plugin rules. [(More about eslint shared settings)](https://eslint.org/docs/user-guide/configuring#adding-shared-settings)

```json
"settings": {
    "tachecker": {
        "pragmas": ["TA", "TAComponents"],
        "checkedComponents": ["Modal", {"name": "Switch", "funcName": "onValueChange"}],
        "taComponents": []  
    }
}
```
**key 说明： `pragmas` 用于指定导入的 TA 组件源文件； `checkedComponents` 指定需要检测是否有taName属性的组件，数组元素可以是字符串，也可以是对象，如果是字符串则默认处理函数是`onPress`；`taComponents` 指定要检测`taName`的 TA 组件，格式和 `checkedComponents` 相同**

## Usage

Add `tachecker` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "tachecker"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "tachecker/exist-taname-checker": 1,
        "tachecker/valid-taname-checker": 1,
        "tachecker/force-import-ta-component": 1,
        "tachecker/ref-checker": 1
    }
}
```

## Supported Rule

- [tachecker/exist-taname-checker](https://github.com/linshaolie/eslint-plugin-tachecker/blob/master/docs/rules/exist-taname-checker.md): Detects whether the component define `taName` property, generating random key when fix it.
- [tachecker/valid-taname-checker](https://github.com/linshaolie/eslint-plugin-tachecker/blob/master/docs/rules/valid-taname-checker.md): Detects whether `taName` is valid.
- [tachecker/force-import-ta-component](https://github.com/linshaolie/eslint-plugin-tachecker/blob/master/docs/rules/force-import-ta-component.md): Detects whether use TA Component.
- [tachecker/ref-checker](https://github.com/linshaolie/eslint-plugin-tachecker/blob/master/docs/rules/ref-checker.md): Detects whether use ref property.

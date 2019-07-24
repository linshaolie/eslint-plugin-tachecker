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
        "checkedComponents": ["Modal", {"name": "Switch", "funcName": "onValueChange"}]
    }
}
```

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
        "tachecker/force-import-ta-component": 1
    }
}
```

## Supported Rule

- [tachecker/exist-taname-checker](https://github.com/linshaolie/eslint-plugin-tachecker/blob/master/docs/rules/exist-taname-checker.md): Detects whether the component define `taName` property, generating random key when fix it.
- [tachecker/valid-taname-checker](https://github.com/linshaolie/eslint-plugin-tachecker/blob/master/docs/rules/valid-taname-checker.md): Detects whether `taName` is valid.
- [tachecker/force-import-ta-component](https://github.com/linshaolie/eslint-plugin-tachecker/blob/master/docs/rules/force-import-ta-component.md)

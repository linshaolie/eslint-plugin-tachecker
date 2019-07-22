# taName名称规则检测 (valid-taname-checker)

检测 taName 书写规范


## Rule Details


The following patterns are considered warnings:

```js

export default class Hello extends React.Component {
    render() {
        return <div taName={'clickSearch'}></div>;
    }
}

```

The following patterns are *not* considered warnings:

```js

export default class Hello extends React.Component {
    render() {
        return <div taName={'submit_btn'}></div>;
    }
}

```

### Rule Options

## When Not To Use It
```js

"tachecker/valid-taname-checker": 0

```

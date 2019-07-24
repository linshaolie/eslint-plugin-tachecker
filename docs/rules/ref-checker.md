# TA组件 ref 检测 (ref-checker)

TA组件不支持使用ref，需要使用 taRef 代替


## Rule Details


The following patterns are considered warnings:

```js
import {TouchableWithoutFeedback} from 'TA';
export default class Hello extends React.Component {
    render() {
        return (
            <TouchableWithoutFeedback
                ref={(r) => {this._touch = r;}}
                onPress={() => {}}
            >
            </TouchableWithoutFeedback>
        );
    }
}
```

```js
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
}
```


The following patterns are *not* considered warnings:

```js
import {TouchableWithoutFeedback} from 'react-native';
export default class Hello extends React.Component {
    render() {
        return (
            <TouchableWithoutFeedback ref={() => {}}>
            </TouchableWithoutFeedback>
        );
    }
}
```

```js
import {Modal} from 'TA';
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
}
```


### Rule Options

## When Not To Use It
```js
"tachecker/ref-checker": 0
```

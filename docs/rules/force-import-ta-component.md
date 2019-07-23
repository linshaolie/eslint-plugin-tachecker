# 强制引入TA组件检测 (force-import-ta-component)

检测引入的组件是否是TA框架的组件


## Rule Details


The following patterns are considered warnings:

```js
import {TouchableWithoutFeedback} from 'react-native;

```

```js
import TouchableWithoutFeedback from 'TouchableWithoutFeedback';
```

```js
const {TouchableWithoutFeedback} = require('react-native');
```

```js
const TouchableWithoutFeedback = require('TouchableWithoutFeedback');
```

The following patterns are *not* considered warnings:

```js
import {TouchableWithoutFeedback} from 'TA';
```

```js
const {TouchableWithoutFeedback} = require('TA');
```

### Rule Options

## When Not To Use It
```js
"tachecker/force-import-ta-component": 0

```

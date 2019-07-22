# taName是否存在检测 (exist-taname-checker)

检测 taName 是否存在，并且可自动生成


## Rule Details


The following patterns are considered warnings:

```js

import React from 'react';
import {TouchableWithoutFeedback} from 'TA';
export default class Hello extends React.Component {
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {}}>
                <Text>test</Text>
            </TouchableWithoutFeedback>
        );
    }
}

```


The following patterns are *not* considered warnings:

```js

import React from 'react';
import {TouchableWithoutFeedback} from 'TA';
export default class Hello extends React.Component {
    render() {
        return (
            {/*don't have onPress property*/}
            <TouchableWithoutFeedback>
                <Text>test</Text>
            </TouchableWithoutFeedback>
        );
    }
}

```

```js

import React from 'react';
import {TouchableWithoutFeedback} from 'TA';
export default class Hello extends React.Component {
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {}} taName={'submit_btn'}>
                <Text>test</Text>
            </TouchableWithoutFeedback>
        );
    }
}

```

```js

/** @ta ignore */
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
}

```

### Rule Options

## When Not To Use It
```js

"tachecker/exist-taname-checker": 0

```

You can use comments to ignore file detection
```js

/** @ta ignore */

```

---
title: webpack.config.js的智能提示
date: "2021-12-07T13:50:13.469Z"
description: vscode为.babelrc，package.json和jsconfig.json这些文件内置了语法提示，但是webpack却没有内置的语法提示。
---

有两种方法打开`webpack.config.js`的语法提示

### 1. 使用`Typescript`定义

在`module.exports`上面引用webpack的配置定义即可

- 以下是有效的：

```javascript
/** @type {import('webpack').Configuration} */
module.exports = {
  // 提示有效
}
```

- 以下是无效的，**注意一定要在module.exports上面一行，中间跨越了其它代码就不起作用了。**

```js
/** @type {import('webpack').Configuration} */
const path = require('path')

module.exports = {
  // 不提示
}
```

`Configuration`来自于[`@types/webpack`](https://www.npmjs.com/package/@types/webpack).



### 2. 使用Schema文件

这种方式适用于以`webpack.config.json`为配置文件的webpack工程（如果你的工程用的webpack.config.js就不适用了）

```json
{
    "$schema": "./node_modules/webpack/schemas/WebpackOptions.json",
    "mode": "development", // 其它配置
}
```

不推荐这种方式配置，因为json配置文件失去了`webpack.config.js`的灵活性和可编程性。
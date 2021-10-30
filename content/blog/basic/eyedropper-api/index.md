---
title: Introduce to EyeDropper API
date: "2021-10-30T09:24:13.469Z"
description: 本文介绍浏览器原生的吸管API（EyeDropper)的现状和使用
---



### EyeDropper API是什么

 EyeDropper，没错！吸管工具，凡是做过前端的人都有过安装一个吸管工具用来吸取设计稿中某个颜色值的经历，今后这个工具浏览器会原生支持了，并且提供全套的API供我们使用。

EyeDropper API是 [Capabilities Project](https://web.dev/fugu-status/) 项目的一部分，目前仍然在开发中。这篇博客会在随着实现的过程随时更新。



### 和`type='color'`的区别

现有的HTML5中，`< input type='color' />`也可以吸取任意地方的颜色，它和EyeDropper API有什么不一样？主要是`input`提供的功能太多了，如果我只需要一个吸管工具的话，放置一个`input`有点小题大作， EyeDropper API提供了一种轻量级的吸色解决方案。

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20211030094832772.png" alt="image-20211030094832772" style="zoom:50%;" />

### 当前状态

| Step                    | Status                                         |
| :---------------------- | :--------------------------------------------- |
| 1. EyeDropper API的解释 | [完成](https://github.com/WICG/eyedropper-api) |
| 2. 初始化的草案和规范   | [完成](https://wicg.github.io/eyedropper-api/) |
| 3. 收集反馈&设计迭代    | [进行中](https://web.dev/eyedropper/#feedback) |
| 4. Origin Trial         | 完成                                           |
| 5. **启动**             | **Chromium 95** (只有桌面版可用)               |



### EyeDropper API使用方法

#### 特征检测和浏览器支持

首先，判断当前浏览器是否支持EyeDropper

```javascript
if ('EyeDropper' in window) {
  // EyeDropper API可用
}
```

注：目前基于Chromium的浏览器（Chrome和Edge)从95版本开始支持EyeDropper API

#### API的使用

先创建 `EyeDropper` 的实例对象，然后调用该实例的 `open()` 方法。

```js
const eyeDropper = new EyeDropper();

try {
  const result = await eyeDropper.open();
  // The user selected a pixel, here is its color:
  const colorHexValue = result.sRGBHex;
} catch (err) {
  // The user escaped the eyedropper mode.
}
```

 调用`open()` 方法会唤起一个吸管的UI，同时返回一个`promise`，当用户吸取屏幕上的任意颜色后`resolve`，接着通过访问resolve后的`sRGBHex` 属性可以获取用户吸取的颜色值， (`格式是#RRGGBB`)；用户如果按`esc`键，进入`reject`状态。

除了`esc`之外，也可以通过编程方式取消吸色：把 [AbortController](https://developer.mozilla.org/docs/Web/API/AbortController) 的`signal`对象传递给 `open()` 方法，如下所示：

```js
const abortController = new AbortController();

try {
  const result = await eyeDropper.open({signal: abortController.signal});
  // ...
} catch (err) {
  // ...
}

// 取消吸色
abortController.abort();
```

总结以上API，提取了一个共通函数:

```js
async function sampleColorFromScreen(abortController) {
  const eyeDropper = new EyeDropper();
  try {
    const result = await eyeDropper.open({signal: abortController.signal});
    return result.sRGBHex;
  } catch (e) {
    return null;
  }
}
```

### 参考资料

- [Public explainer](https://github.com/WICG/eyedropper-api)
- [EyeDropper API Demo](https://captainbrosset.github.io/eyedropper-demos/) | [EyeDropper API Demo source](https://github.com/captainbrosset/eyedropper-demos)
- [Chromium tracking bug](https://bugs.chromium.org/p/chromium/issues/detail?id=897309)
- [ChromeStatus.com entry](https://bugs.chromium.org/p/chromium/issues/detail?id=897309)
- [TAG Review](https://github.com/w3ctag/design-reviews/issues/587)
- [WebKit position request](https://lists.webkit.org/pipermail/webkit-dev/2021-July/031929.html)
- [Mozilla position request](https://github.com/mozilla/standards-positions/issues/557)
- [Intent to Ship](https://groups.google.com/a/chromium.org/g/blink-dev/c/rdniQ0D5UfY/m/Aywn9XyyAAAJ)
- [Picking colors of any pixel on the screen with the EyeDropper API](https://web.dev/eyedropper/)


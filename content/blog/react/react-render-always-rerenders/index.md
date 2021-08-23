---
title: React Rendering教程（1） - It Always Re-renders
date: "2021-08-23T14:22:28.128Z"
description: 什么时候React组件会重新渲染？是当它的state或者props改变的时候吗？
---

> [原文地址](https://alexsidorenko.com/blog/react-render-always-rerenders/)

先上图：

 <img src="https://alexsidorenko.com/6a963b5633b0c2026c6115bd5058703f/parent-rerender.gif" style="zoom:80%;" />

先看上图 👆，APP的父子结构是： `App > A > B > C`，代码如下：

```jsx
const App = () => {
  // 只有App组件里维护了state
  return (
    <ComponentA />
  )
};
// A、B、C组件没有自己的state
const ComponentA = () => <ComponentB />;
const ComponentB = () => <ComponentC />;
```

组件A，B，C没有任何`props`和`state`，但是当`App`重新渲染时他们仍然是会重新渲染的。

> 在正常的渲染过程中，React不会在乎子组件的`props`是不是变化了，它会无条件地重新渲染子组件，因为父组件重新渲染了。
>
> Mark Erikson - [A (Mostly) Complete Guide to React Rendering Behavior](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#standard-render-behavior)

为了进一步演示上面的结论，我们给每个组件加上自己的`state`来跟踪这一行为。

 <img src="https://alexsidorenko.com/728abfb0a5d4c5e903945ed97934ef40/state.gif" style="zoom:80%;" />

当`C`组件的`state`变化时，只有`C`组件重新渲染。但是当`B`组件的`state`变化时， `B`和`C`都重新渲染了。`B`重新渲染是因为它的`state`更新了，而`C`的重新渲染则是因为它的父组件（B）重新渲染了。

当`A`的`state`更新时`A`会重新渲染了。`B`的重新渲染则是因为`A`，最后`C`的重新渲染则是因为`B`



### 如何避免重新渲染

在React中有好多方法可以避免不必要的`re-render`。本文会聚集于 `React.memo` 这种方式（其它方式将会在后续的文章中介绍）。如果你对 `memo`有兴趣，可以阅读一下丹大师的[Before you memo()](https://overreacted.io/before-you-memo/)

> 在这篇文章中也请记住这一点，我只会探索直接更新`state`或是父组件更新而导致的重新渲染，不会传递任何`props`（props变化的情况下一篇blog会讨论）

如果用 `memo`包裹了组件，当父组件重新渲染时，他是不会重新渲染的。

 <img src="https://alexsidorenko.com/ef91c51dd8092299ccb379791105042f/memo-1.gif" style="zoom:80%;" />

注意：`C`组件因为`state`的更新而重新渲染，但是它的父组件B重新渲染后，它并没有重新渲染。



### 提升memo层级

把 `memo`的层级向上提升，看看会发生什么

 <img src="https://alexsidorenko.com/7066ca50f1588ee582721662a5450ea0/memo-2.gif" style="zoom:80%;" />

`A/B/C`因为`state`更新导致的重新渲染，结论和之前一样。但是App的重新渲染不影响下面的子组件。结论是：**用`memo`包裹的组件，会阻止它整个子树上的组件因为父组件（也就是这个用memo包裹的组件）更新而导致的重新渲染**

所以你会看到这样的建议：（Contex tProvider组件应该使用`React.memo`）

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210823161114344.png" alt="image-20210823161114344" style="zoom:50%;" />



### 兄弟（相邻）组件如何？

 <img src="https://alexsidorenko.com/575822f38738dfb52665d0cc137d503a/adjacent.gif" alt="https://alexsidorenko.com/575822f38738dfb52665d0cc137d503a/adjacent.gif" style="zoom:80%;" />

兄弟组件也符合上面的规则，用 `memo` 包裹的组件不会随着父组件更新而re-render，而且它的子组件树也不会重新渲染。



### 所有的组件都使用`memo`吗

假如 `memo`对提高性能有如此之大的效果，那用`memo`来包裹一切组件有意义吗？答案是：并不是。但这个是下一篇Blog要写的东西了。

此外，所果你有兴趣的话可以阅读一下这篇文章[Fix the slow render before you fix the re-render](https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render) （Kent C. Dodds）


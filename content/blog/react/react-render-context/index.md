---
title: React Rendering教程（5） - Context
date: "2021-08-24T15:06:41.111Z"
description: 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。
---

> [原文地址](https://alexsidorenko.com/blog/react-render-context/)

当组件消费`Context`的时候，如果`context`值变了，组件会重新渲染。但是下面的示例中为什么 `Component A` and `Component B` 也重新渲染了？

<video style="aspect-ratio: 1360/1121" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/345403c36ea184fe348d0e3996725309/initial.mp4"></video>

组件树的结构为 `App (ContextProvider) > A > B > C`

```jsx
const App = () => {
  // ...
  return (
    <AppContext.Provider ...>
      <ComponentA />
    </AppContext.Provider>
  )
};

const ComponentA = () => <ComponentB />;
const ComponentB = () => <ComponentC />;
```

### Context和Rendering

第一篇Blog中，我们了解了React Rendering的行为。当组件重新渲染时，React会递归的重新渲染它的子组件， 并且会无视它们的`props`和`context`。如果把上面示例中的`context`移除掉会发什么，请看下面示例：

<video style="aspect-ratio: 1360/895" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/d9096d3e51b8bf32d6ba597e91c2793e/no-context.mp4"></video>

为了防止递归的重新渲染，我们可以使用`memo`，我们给一开始的示例再加上 `memo` 

<video style="aspect-ratio: 1360/1127" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/3347fc58a2f5a947c6cf4bba84244a4f/memo.mp4"></video>

所以 👇

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210824142052905.png" alt="image-20210824142052905" style="zoom:40%;" />



### Context 和引用

实际应用中，会经常通过`context`传递更多的数据。有时候数据会依赖某些`state`的变量

<video style="aspect-ratio: 1360/1195" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/9e4b54f5eb5785ecff6c8bfd344f3439/text.mp4"></video>

我们只把 `a` 和 `b`传递给了`Provider`，但当`count`更新时，消费的组件也重新渲染了。如何防止出现这种情况？

提示： `text`是一个对象，它是非原始类型（non-primitive）

> 所有的`Consumer`都是`Provider`的子孙节点，当`Provider`的`value`变化时，会重新渲染
>
> [React Docs - Context Provider](https://reactjs.org/docs/context.html#contextprovider)

当 `count` 的值更新时，`App`组件重新渲染，导致 `text` 变量重新声明和赋值（变成一个新的变量）。我们现在已经知道了原始类型和引用类型的区别。 `{a: "lorem", b: "ipsum"} !== {a: "lorem", b: "ipsum"}`意味着每一次App重新渲染时，即使`a`和`b`的值没有变，`context`的值也会发生变化。因此`consumer`也重新渲染了。为了防止出现这种情况，我们需要保证 `text` 变量一直维持相同对象的引用。之前的Blog中有介绍，我们可以使用 `useMemo`，所下所示：

<video style="aspect-ratio: 1360/1195" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/732fa2873e4805de5f45ae3e1dde6dca/usememo.mp4"></video>

现在 `text` 变量只有在 `useMemo` 依赖列表（a和b）发生变化时，才会重新定义并赋值。 `count` 不在依赖列表中，所以即使`count` 变了， `text` 也不会发生任何变化，`consumer`也不会重新渲染。
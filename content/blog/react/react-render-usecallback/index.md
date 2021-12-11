---
title: React Rendering教程（4） - useCallback
date: "2021-08-24T13:22:02.383Z"
description: 我们经常会把匿名函数作为事件处理器传递给React组件。即使子组件被`memo`包裹，也会引起子组件的重新渲染
---

> [原文地址](https://alexsidorenko.com/blog/react-render-usecallback/)

我们经常会把匿名函数作为事件处理器传递给React组件。即使子组件被`memo`包裹，也会引起子组件的重新渲染

<video style="aspect-ratio: 1360/665" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/a74a21ec4b3136079f1597f02301f898/initial.mp4"></video>

### JS中的函数

函数是一等公民

> 当一门编程语言的函数可以被当作变量一样用时，则称函数是这门语言的**一等公民**。例如，在这门语言中，函数可以被当作参数传递给其他函数，可以作为另一个函数的返回值，还可以被赋值给一个变量。
>
> [MDN - First-class Function](https://developer.mozilla.org/zh-CN/docs/Glossary/First-class_Function)

当这样传递一个匿名函数时，很容易忽略`onClick`仅仅只是组件的一个`prop`，而函数也仅仅只是这个`prop`的值。如果把函数赋值给一个变量时，会更容易看出这一点，如下图所示：

<video style="aspect-ratio: 1360/776" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/22835a82687aab5f649e792f80720ac4/declare-function.mp4"></video>

这种方式更加明显了，`handler`存储了`onClick` 的值（函数）。无论什么时候这个值变了，子组件都会重新渲染。函数是非原始类型，只会进行引用的比较。

```javascript
const a = () => 1;
const b = () => 1;
a === b // false
a === a // true
```

父组件渲染时，`handler`实际上会重新声明并被赋上新的引用值，因此子组件也触重新渲染。想要防止这种情况，需要每次都给 `onClick` prop传递相同的引用，这时候我们需要记住并缓存 `handler`.



### useCallback hook

之前的Blog中介绍了 `useMemo` 在每次render时是如何重新计算和缓存值的。 `useCallback` 和它本质上是完全一样的，唯一的区别是`useCallback`返回的是函数。

> useCallback(fn, deps) 等价于 useMemo(() => fn, deps).
>
> [React Docs - useCallback](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback)

所以，如果想要缓存`handler`的引用，只要把用 `useCallback`包裹一下就行了，先看下面的示例：

<video style="aspect-ratio: 1360/778" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/3b1f1e02cc97c253db02a9169b9e9c38/empty-dependencies.mp4"></video>

可以看到子组件不再重新渲染了，但是`count`不管你点多少次按钮只更新了1次。这也是依赖列表的原因。  `useMemo`和 `useCallback` 一样，只有在依赖列表中的项目发生变化时才会重新计算和更新缓存。 `handler` 在第1次render时会被缓存。由于闭包的存在，即使`count`发生了变化，记忆的函数引用的也是之前的`count`值。在上面的示例中，引用的`count`始终是`0`，因此 `count + 1` 始终是 `1`.

> 如果你不知道啥是`闭包`，请参考这篇文档 - [MDN -Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) 有很多消化的东西，请按需食用。一开始你可能很难理解闭包的概念，但理解闭包将给你React带来超能力。

为了使`update`可以更新，可以把`update`放在依赖列表中。通过这种方法 `useCallback` 只要`count`变化时就会重新计算并返回一个持有最新词法作用域的 `handler` 

<video style="aspect-ratio: 1360/778" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/cfc69f54ded494e3a7753bd21946fa3d/count-dependency.mp4"></video>

噗，又回到原点了。子组件也会一起跟着重新渲染，因为`handler`每次都会随着`count`的改变而更新。为了解决这个问题，可以使用**函数式更新**。

### 函数式更新

> 如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 state，并返回一个更新后的值。
>
> [React Docs - Functional Updates](https://zh-hans.reactjs.org/docs/hooks-reference.html#functional-updates)

下面是函数式更新的示例：

```javascript
// State update
setCount(count + 1)

// Functional state update
setCount(prevCount => prevCount + 1)
```

函数式更新可以让我们把`count`从依赖列表中移除，而不用担心闭包的问题。函数 `handler` 不会随着`count`改变而重新计算，而且 `prevCount` 会始终引用最新的值。

<video style="aspect-ratio: 1360/837" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/9401a1fb31656179d6294bf4ad068c2c/functional-update.mp4"></video>

完美解决！
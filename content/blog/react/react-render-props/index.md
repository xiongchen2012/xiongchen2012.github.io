---
title: React Rendering教程（2） - Props
date: "2021-08-23T20:10:28.128Z"
description: 子组件用memo包裹时，即使它的props没有变化，父组件渲染时为什么仍然会重新渲染？
---

> [原文地址](https://alexsidorenko.com/blog/react-render-props/)

子组件用memo包裹时，即使它的props没有变化，父组件重新渲染时为什么它仍然会重新渲染？

<video style="aspect-ratio: 1360/444" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/d91b67ddf615a785590f75ad157804ee/non-primitive-prop-rerenders-v3.mp4"></video>

JS中有两种类型的值，理解它们的差异可以帮助我们更好的理解组件rendering

### 原始类型（Primitives）

第一种类型是将原始类型（`number`，`string`，`boolean`，`undefined`，`null`，`symbol`，`bigint`）作为props

<video style="aspect-ratio: 1360/523" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/9b11be0c45b37887f2d0fd78f7fd66b2/primitive-value-v3.mp4"></video>

如果子组件被`memo`包裹，意味着只有当它的`props`变化时才会重新渲染。`memo`判断`prpos`是否变化的方法是对props进行一次浅比较（ `prevProp === nextProp`）因为 `"Alex"`是一个原始类型（字符串）所以这个判断返回值是`true`（即props没有发生变化），所以组件不会重新渲染。



### 非原始类型（Non-primitives）

第2种类型就是非原始类型，现在给`props`传递一个对象（非原始类型），为什么非原始类型就会使得子组件重新渲染呢？

<video style="aspect-ratio: 1360/444" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/d91b67ddf615a785590f75ad157804ee/non-primitive-prop-rerenders-v3.mp4"></video>

记住，`memo`能过进行浅比较来判定props是否改变。当比较两个非原始类型，例如： `{display: "flex"} === {display: "flex"}`, 结果是`false`。

> 在JavaScript中，对象是引用类型。两个不同的对象永远不会相等，即使他们有完全相同的属性和值。只有比较两个相同引用的对象，结果才会是true。具体如何比较对象，可以参考：[MDN - Comparing Objects](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#%E6%AF%94%E8%BE%83%E5%AF%B9%E8%B1%A1)



### 引用

引用类型的变量是内存中的某个值的指针。如下图所示：

 ![reference](https://alexsidorenko.com/static/feeeef14e54a1741e7b174f4450a5cf1/f058b/references.png)

尽管`a` 和 `b`看起来完全一样，但是它两指向了内存中不同的值。 所以a===b返回`false`，关于引用类型，可以参考 [You Don’t Know JS (Values vs References)](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/apA.md#values-vs-references) 

知道了这些，我们该怎么防止子组件重新渲染？最简单的方法是在**组件树之外**定义一个变量，然后将它作为props传递下去，如下图所示：

<video style="aspect-ratio: 1360/585" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/47d025c8787e15b6561475091a65d1e0/declare-var-v3.mp4"></video>

用上面这种方法，当 `memo`比较props时，进行的比较是 `style === style // true` ，而不是 `{display: "flex"} === {display: "flex"} // false`

注意：如果你是在父组件中定义的变量，上面的方法就会失效，如下所示：

<video style="aspect-ratio: 1360/584" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/31057d13093656291bfc4484ed7ad3ce/declare-var-inside-v3.mp4"></video>

这是因为每一次父组件渲染后， `style` 变量又被重新声明了（变成了一个新的对象引用）



### 匿名函数

函数和组件也是经常在React中用到的非原始类型。React中经常会传递匿名函数作为事件处理函数，如下所示：

<video style="aspect-ratio: 1360/442" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/29d4c89bab328ff06f23643da0f99d3c/anonymous-function-v3.mp4"></video>

函数也是非原始类型，因而会采用上节提到的相同的比较规则。如果想防止子组件重新渲染，则需要为`props`提供同一个引用对象，如下图所示：

<video style="aspect-ratio: 1360/565" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/02b5ea5370b71cefd29049299f4ad3c1/anonymous-function-reference-v3.mp4"></video>

### Memoization

实际的应用中，把非原始类型值其作为`props`传递时，可能会依赖于组件的`state`和其它`props`

<video style="aspect-ratio: 1360/446" autoplay="" loop="" muted="" playsinline="" src="https://alexsidorenko.com/e0880d4a6b3170f39d4787f64f8c79e9/memoization-v3.mp4"></video>

在这个示例中，不能将这个函数在React组件外部定义，而是必须在Parent组件内部定义（因为子组件想把某些值传给父组件）。但如何防止在每一次父组件re-render之后，子组件因为`onClick`重新声明并赋值而导致的重新渲染呢？这就是为什么React要提供 `useMemo` 和 `useCallback` 两个Hook来**记忆**这些`props`的值，且听下回分解。

